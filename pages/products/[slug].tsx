import styles from '@styles/Product.module.css'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next'
import Link from 'next/link'
import { Image } from '@components/Image'
import { Layout } from '@components/Layout'
import { client } from '@services/client'
import { GET_PRODUCT, GET_PRODUCTS } from '@services/queries'
import { useRouter } from 'next/router'
import { readFileSync } from 'fs'
import path from 'path'

type ProductProps = {
  product: {
    name: string
    image: string
  }
}

type StaticPath = {
  params: {
    slug: string
  }
  locale: string
}

type GetProduct = {
  slug: string
  isPreview?: boolean
  locale?: string
}

async function getProduct({ isPreview = false, slug, locale }: GetProduct) {
  const { data } = await client.query<ProductData>({
    query: GET_PRODUCT,
    variables: {
      slug,
      preview: isPreview,
      locale,
    },
    fetchPolicy: 'network-only',
    context: {
      headers: {
        Authorization: `Bearer ${process.env.PREVIEW_ACCESS_TOKEN}`,
      },
    },
  })

  const item = data.productCollection.items[0]

  const product = {
    image: item.image.url,
    name: item.name,
  }

  return product
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  if (!locales) {
    throw new Error('Locale not found')
  }

  const { data } = await client.query<ProductData>({
    query: GET_PRODUCTS,
    variables: { limit: 10 },
  })

  const paths: StaticPath[] = data.productCollection.items
    .map(item => ({
      params: {
        slug: item.slug,
      },
    }))
    .flatMap(path => locales.map(locale => ({ locale, ...path })))

  const readPaths = readFileSync(path.join(process.cwd(), 'paths.txt'), 'utf-8')
  const parsePaths = readPaths.split('\n').filter(Boolean)

  const getPaths: StaticPath[] = parsePaths
    .map(slug => ({
      params: {
        slug,
      },
    }))
    .flatMap(path => locales.map(locale => ({ locale, ...path })))

  return {
    paths: [...paths, ...getPaths],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<ProductProps> = async ({
  params,
  preview,
  locale,
}) => {
  const slug = params?.slug

  if (typeof slug !== 'string') {
    return {
      notFound: true,
    }
  }

  try {
    const product = await getProduct({ slug, isPreview: preview, locale })
    return {
      props: {
        product,
      },
      revalidate: 5 * 60, // once every 5 minutes
    }
  } catch (e) {
    return {
      notFound: true,
    }
  }
}

const Product = ({
  product,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter()

  if (router.isFallback) {
    return (
      <Layout>
        <h1 className={styles.title}>Loading...</h1>
      </Layout>
    )
  }

  return (
    <Layout title={product.name}>
      <div className={styles.container}>
        <div className={styles.back}>
          <Link href="/">
            <a>
              <Back /> Back to bee
            </a>
          </Link>
        </div>
        <div className={styles.grid}>
          <div className={styles.description}>
            <h1 className={styles.title}>{product.name}</h1>
            <p className={styles.article}>{product.name}</p>
          </div>
          <div className={styles.media}>
            <Image
              src={product.image}
              alt={product.name}
              width={800}
              height={800}
              aspectRatio="16:9"
              fit="fill"
              priority
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

const Back = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M4.64977 3.35029C4.92235 3.07771 5.36409 3.07709 5.63743 3.34891V3.34891C5.912 3.62195 5.91244 4.06613 5.63841 4.33972L2.68999 7.28342L15.2789 7.28342C15.6746 7.28342 15.9954 7.60424 15.9954 8V8C15.9954 8.39576 15.6746 8.71658 15.2789 8.71658L2.68999 8.71658L5.639 11.6656C5.91254 11.9391 5.9113 12.383 5.63624 12.655V12.655C5.36334 12.9249 4.92371 12.9237 4.65232 12.6523L0.353606 8.35355C0.158344 8.15829 0.158345 7.84171 0.353607 7.64644L4.64977 3.35029Z"
      fill="currentColor"
    />
  </svg>
)

export default Product

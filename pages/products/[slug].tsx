import styles from '@styles/Product.module.css'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/future/image'
import { useRouter } from 'next/router'
import { Layout } from '@components/Layout'
import { client } from '@services/client'
import { GET_PRODUCT } from '@services/queries'

type ProductInfo = {
  name: string
  image: string
}

async function getProduct(args: { slug: string }) {
  const { data } = await client.query<ProductData>({
    query: GET_PRODUCT,
    variables: args,
  })

  const item = data.productCollection.items[0]

  const product = {
    image: item.image.url,
    name: item.name,
  }

  return product
}

const Product = () => {
  const router = useRouter()
  const { slug } = router.query

  const [status, setStatus] = useState({ loading: true, error: false })
  const [product, setProduct] = useState<ProductInfo | null>(null)

  useEffect(() => {
    if (typeof slug !== 'string') return

    getProduct({ slug })
      .then(data => {
        setProduct(data)
        setStatus(previousStatus => ({ ...previousStatus, loading: false }))
      })
      .catch(() => {
        setStatus(previousStatus => ({
          ...previousStatus,
          loading: false,
          error: true,
        }))
      })
  }, [slug])

  if (status.loading) {
    return (
      <Layout>
        <h1 className={styles.title}>Loading...</h1>
      </Layout>
    )
  }

  if (!product || status.error) {
    return (
      <Layout>
        <h1 className={styles.title}>Not Found</h1>
      </Layout>
    )
  }

  return (
    <Layout title={`${slug}`}>
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

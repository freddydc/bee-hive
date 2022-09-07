import styles from '@styles/Home.module.css'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { Layout } from '@components/Layout'
import { Grid } from '@components/Grid'
import { ProductCard } from '@components/ProductCard'
import { client } from '@services/client'
import { GET_PRODUCTS } from '@services/queries'

type HomeProps = {
  products: Product[]
}

const getProducts = async (args: { limit: number }) => {
  const { data } = await client.query<ProductData>({
    query: GET_PRODUCTS,
    variables: args,
  })

  const products = data.productCollection.items.map(item => ({
    name: item.name,
    image: item.image.url,
    slug: item.slug,
    id: item.sys.id,
  }))

  return products
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const products = await getProducts({ limit: 10 })

  return {
    props: {
      products,
    },
    revalidate: 5 * 60, // once every 5 minutes
  }
}

const Home = ({ products }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Layout>
      <h1 className={styles.title}>Featured</h1>
      <Grid>
        {products.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </Grid>
    </Layout>
  )
}

export default Home

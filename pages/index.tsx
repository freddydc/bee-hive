import styles from '@styles/Home.module.css'
import { useEffect, useState } from 'react'
import { Layout } from '@components/Layout'
import { Grid } from '@components/Grid'
import { ProductCard } from '@components/ProductCard'
import { client } from '@services/client'
import { GET_PRODUCTS } from '@services/queries'

const getProducts = async (args: { limit: number }) => {
  const { data } = await client.query<ProductData>({
    query: GET_PRODUCTS,
    variables: args,
  })

  const products = data.productCollection.items.map(item => ({
    name: item.name,
    image: item.image.url,
    id: item.sys.id,
  }))

  return products
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    getProducts({ limit: 10 }).then(data => setProducts(data))
  }, [])

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

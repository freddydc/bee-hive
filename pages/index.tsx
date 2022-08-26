import styles from '@styles/Home.module.css'
import { useEffect } from 'react'
import { Layout } from '@components/Layout'
import { client } from '@services/client'
import { GET_PRODUCTS } from '@services/queries'

const getProducts = (args: { limit: number }) =>
  client.query({
    query: GET_PRODUCTS,
    variables: args,
  })

const Home = () => {
  useEffect(() => {
    getProducts({ limit: 5 }).then(data => console.log(data))
  }, [])

  return (
    <Layout>
      <h1 className={styles.title}>Hello!</h1>
    </Layout>
  )
}

export default Home

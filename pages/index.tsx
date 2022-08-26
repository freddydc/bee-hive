import styles from '@styles/Home.module.css'
import { useEffect } from 'react'
import { Layout } from '@components/Layout'

const fetchProducts = () =>
  fetch(process.env.NEXT_PUBLIC_API_URL ?? '/api/hello', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      query: `{
        productCollection(limit: 5) {
          items {
            name
          }
        }
      }
      `,
    }),
  })

const Home = () => {
  useEffect(() => {
    fetchProducts()
      .then(res => res.json())
      .then(data => console.log(data))
  }, [])

  return (
    <Layout>
      <h1 className={styles.title}>Hello!</h1>
    </Layout>
  )
}

export default Home

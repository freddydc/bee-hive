import styles from '@styles/Home.module.css'
import { Layout } from '@components/Layout'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <Layout>
      <div className={styles.message}>
        <div>
          <h1>🔥 We are sorry</h1>
          <p>We could not find what you were looking for</p>
          <Link href={'/'}>
            <a>Go back home</a>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

import styles from '@styles/Home.module.css'
import { Layout } from '@components/Layout'
import Link from 'next/link'

export default function ServerErrorPage() {
  return (
    <Layout>
      <div className={styles.message}>
        <div>
          <h1>🔥 Something went wrong</h1>
          <p>Try again in a few minutes</p>
          <Link href={'/'}>
            <a>Go back home</a>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

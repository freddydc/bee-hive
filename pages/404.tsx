import styles from '@styles/Home.module.css'
import { Layout } from '@components/Layout'
import Link from 'next/link'
import { useTranslation } from '@hooks/useTranslation'

export default function NotFoundPage() {
  const t = useTranslation()
  return (
    <Layout>
      <div className={styles.message}>
        <div>
          <h1>🔥 {t.errors.sorry}</h1>
          <p>{t.errors.notFound}</p>
          <Link href={'/'}>
            <a>{t.common.backHome}</a>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

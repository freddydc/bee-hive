import styles from '@styles/Home.module.css'
import type { NextPageContext } from 'next'
import Link from 'next/link'
import { Layout } from '@components/Layout'
import ServerError from './500'
import NotFound from './404'
import { useTranslation } from '@hooks/useTranslation'

type ErrorPageProps = {
  statusCode?: number
  message?: string
}

function ErrorPage({ message, statusCode }: ErrorPageProps) {
  const t = useTranslation()
  if (statusCode === 404) {
    return <NotFound />
  }

  if (statusCode && statusCode > 500) {
    return <ServerError />
  }

  const messages = statusCode ? t.errors.serverError : t.errors.clientError

  const errorMessage = message ?? messages

  return (
    <Layout>
      <div className={styles.message}>
        <div>
          <h1>🐏</h1>
          <p>{errorMessage}</p>
          {statusCode ? (
            <p>
              {t.errors.status}: {statusCode}
            </p>
          ) : null}
          <Link href={'/'}>
            <a>{t.common.backHome}</a>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  if (res) {
    return { statusCode: res.statusCode }
  }

  if (err) {
    return { statusCode: err.statusCode }
  }

  return { statusCode: 404 }
}

export default ErrorPage

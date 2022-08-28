import styles from './Layout.module.css'
import Head from 'next/head'
import { Navbar } from '@components/Navbar'
import { Footer } from '@components/Footer'

type LayoutProps = {
  title?: string
  children: React.ReactNode
}

const SITE_BRAND = 'Bee'

export const Layout = ({ children, title }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{!title ? SITE_BRAND : `${title} - ${SITE_BRAND}`}</title>
      </Head>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </>
  )
}

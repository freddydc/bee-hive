import styles from './Layout.module.css'
import Head from 'next/head'
import { Navbar } from '@components/Navbar'
import { Footer } from '@components/Footer'
import { useRouter } from 'next/router'
import Link from 'next/link'

type LayoutProps = {
  title?: string
  children: React.ReactNode
}

const SITE_BRAND = 'Bee'

export const Layout = ({ children, title }: LayoutProps) => {
  const { isPreview } = useRouter()

  return (
    <>
      <Head>
        <title>{!title ? SITE_BRAND : `${title} - ${SITE_BRAND}`}</title>
      </Head>
      {isPreview && <PreviewModeBanner />}
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </>
  )
}

function PreviewModeBanner() {
  return (
    <div className={styles.banner}>
      <Link href="/api/exit-preview">
        <a>
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          Exit Preview Mode
        </a>
      </Link>
    </div>
  )
}

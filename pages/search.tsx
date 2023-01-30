import styles from '@styles/Search.module.css'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Grid } from '@components/Grid'
import { Layout } from '@components/Layout'
import { ProductCard } from '@components/ProductCard'
import { useDebounce } from '@hooks/useDebounce'
import { useTranslation } from '@hooks/useTranslation'
import { useInfinitySearch } from '@hooks/useInfinitySearch'

export default function SearchPage() {
  const { locale } = useRouter()
  const t = useTranslation()
  const [term, setTerm] = useState('')
  const searchTerm = useDebounce(term, 500)
  let products: Product[] = []

  const changeTerm: React.ChangeEventHandler<HTMLInputElement> = e =>
    setTerm(e.target.value)

  const { data, status, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfinitySearch(
      {
        term: searchTerm,
        limit: 6,
        locale,
      },
      {
        enabled: searchTerm.trim().length > 0,
        staleTime: Infinity,
      }
    )

  if (data && data.pages) {
    products = data.pages
  }

  return (
    <Layout>
      <div className={styles.searchArea}>
        <div className={styles.searchForm}>
          <label htmlFor="search-product">
            <Search />
          </label>
          <input
            id="search-product"
            type="text"
            placeholder={t.search.label}
            autoComplete="off"
            value={term}
            onChange={changeTerm}
          />
          {term && (
            <button className={styles.cleanQuery} onClick={() => setTerm('')}>
              <CloseMark />
            </button>
          )}
        </div>
      </div>
      {status === 'success' && products.length === 0 && term && (
        <h1 className={styles.message}>
          {t.search.notFound} <span>&apos;{term}&apos;</span>
        </h1>
      )}
      <Grid>
        {products.length > 0 &&
          products.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
      </Grid>
      {hasNextPage && (
        <div className={styles.showMore}>
          <button
            className={`${isFetchingNextPage ? styles.animatePulse : ''}`}
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? t.search.loading : t.search.showMore}
          </button>
        </div>
      )}
    </Layout>
  )
}

const Search = () => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={styles.searchIcon}
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
)

const CloseMark = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={styles.closeMarkIcon}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
)

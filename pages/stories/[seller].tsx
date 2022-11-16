import styles from '@styles/Seller.module.css'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { GET_SELLERS } from '@services/queries'
import { useProductsBySeller } from '@hooks/useProductsBySeller'
import { client } from '@services/client'
import { Layout } from '@components/Layout'
import { ProductCard } from '@components/ProductCard'
import { SellerCard } from '@components/SellerCard'
import { Grid } from '@components/Grid'
import Error from '../_error'

type StoryPageProps = {
  sellers: Seller[]
}

type VerticalTabs = {
  tabItems: React.ReactNode[]
  tabPanels: React.ReactNode[]
}

async function getSellers({ limit }: { limit: number }): Promise<Seller[]> {
  const { data } = await client.query<SellerStack>({
    query: GET_SELLERS,
    variables: { limit },
  })

  const sellers = data.sellerCollection.items.map(seller => ({
    id: seller.sys.id,
    description: seller.description,
    manage: seller.manage,
    image: seller.image.url,
    name: seller.name,
  }))

  return sellers
}

export const getServerSideProps: GetServerSideProps<StoryPageProps> = async ({
  params,
}) => {
  const sellerManage = String(params?.seller)

  try {
    const sellers = await getSellers({ limit: 10 })
    const existSeller = sellers.some(seller => seller.manage === sellerManage)

    if (sellers.length > 0 && !existSeller) {
      const firstSeller = sellers[0].manage
      return {
        redirect: {
          destination: `/stories/${firstSeller}`,
          permanent: false,
        },
      }
    }

    return {
      props: {
        sellers,
      },
    }
  } catch (e) {
    return {
      props: {
        sellers: [],
      },
    }
  }
}

function StoryPage({
  sellers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const currentSeller = router.query.seller

  if (typeof currentSeller !== 'string' || sellers.length === 0) {
    return <Error message="No information available" />
  }

  const { tabItems, tabPanels } = sellers.reduce<VerticalTabs>(
    (acc, seller) => {
      const { tabItems, tabPanels } = acc
      tabItems.push(
        <Tab
          key={seller.id}
          isActive={currentSeller === seller.manage}
          label={seller.name}
          onClick={() => {
            router.push(`/stories/${seller.manage}`, undefined, {
              shallow: true,
            })
          }}
        />
      )
      tabPanels.push(
        <TabPanel key={seller.id} isHidden={seller.manage !== currentSeller}>
          <StoryCard seller={seller} />
        </TabPanel>
      )
      return acc
    },
    {
      tabItems: [],
      tabPanels: [],
    }
  )

  return (
    <Layout title={currentSeller}>
      <div className={styles.container}>
        <h1 className={styles.title}>Trending</h1>
        <div className={styles.verticalTab}>
          <div className={styles.menu}>{tabItems}</div>
          {tabPanels}
        </div>
      </div>
    </Layout>
  )
}

type StoryCardProps = {
  seller: Seller
}

function StoryCard({ seller }: StoryCardProps) {
  const {
    data: products,
    error,
    loading,
  } = useProductsBySeller({
    sellerId: seller.id,
    limit: 12,
  })

  return (
    <div className={styles.storyCard}>
      <SellerCard {...seller} />
      {loading ? <div className={styles.loading}>Loading...</div> : null}
      {error ? <div className={styles.error}>Something Went Wrong</div> : null}
      {!loading && !error ? (
        <Grid>
          {products.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </Grid>
      ) : null}
    </div>
  )
}

type TabProps = {
  label: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  isActive: boolean
}

function Tab({ label, onClick, isActive }: TabProps) {
  return (
    <div className={`${styles.tab} ${isActive ? styles.activeTab : ''}`}>
      <button onClick={onClick} className={styles.button}>
        {label}
      </button>
    </div>
  )
}

type TabPanelProps = {
  children: React.ReactNode
  isHidden: boolean
}

function TabPanel({ isHidden, children }: TabPanelProps) {
  return <>{isHidden ? null : children}</>
}

export default StoryPage

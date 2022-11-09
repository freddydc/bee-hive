import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Error from 'next/error'
import { GET_SELLERS } from '@services/queries'
import { client } from '@services/client'

type StoryProps = {
  status: number
}

type GetSellers = Omit<Seller, 'id' | 'name' | 'image' | 'description'>

async function getSellers({ limit }: { limit: number }): Promise<GetSellers[]> {
  const getSellers = await client.query<SellerStack>({
    query: GET_SELLERS,
    variables: { limit },
  })

  const sellers = getSellers.data.sellerCollection.items.map(({ manage }) => ({
    manage,
  }))

  return sellers
}

export const getServerSideProps: GetServerSideProps<StoryProps> = async () => {
  try {
    const sellers = await getSellers({ limit: 1 })

    if (sellers.length > 0) {
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
        status: 412,
      },
    }
  } catch (e) {
    return {
      props: {
        status: 400,
      },
    }
  }
}

function Story({
  status,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <Error statusCode={status} />
}

export default Story

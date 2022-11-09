import { client } from '@services/client'
import { GET_PRODUCTS_BY_SELLER } from '@services/queries'
import { useEffect, useState } from 'react'

type GetProductsBySeller = {
  sellerId: string
  limit?: number
}

async function getProductsBySeller({ sellerId, limit }: GetProductsBySeller) {
  const { data } = await client.query<ProductsBySellerStack>({
    query: GET_PRODUCTS_BY_SELLER,
    variables: {
      sellerId,
      limit,
    },
  })

  const products = data.productCollection.items.map(product => ({
    image: product.image.url,
    name: product.name,
    slug: product.slug,
    id: product.sys.id,
  }))

  return products
}

export function useProductsBySeller({ sellerId, limit }: GetProductsBySeller) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<Product[]>([])

  useEffect(() => {
    setLoading(true)
    getProductsBySeller({ sellerId, limit })
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(e => {
        setError(e)
        setLoading(false)
      })
  }, [sellerId, limit])

  return {
    data,
    error,
    loading,
  }
}

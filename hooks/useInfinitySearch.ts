import { QueryFunction, useInfiniteQuery } from '@tanstack/react-query'
import { SEARCH_PRODUCTS } from '@services/queries'
import { client } from '@services/client'

type QueryArgs = {
  term: string
  limit?: number
  locale?: string
  skip?: number
}

type Opts = {
  enabled?: boolean
  staleTime?: number
}

type ProductQuery = {
  productCollection: Items<
    Pick<Product, 'id' | 'name' | 'slug'> & {
      sys: ID
      image: Image
    }
  > & {
    total: number
    limit: number
    skip: number
  }
}

type QueryKey = ['search_product', Omit<QueryArgs, 'skip'>]

export function useInfinitySearch(args: Omit<QueryArgs, 'skip'>, opts?: Opts) {
  return useInfiniteQuery({
    ...opts,
    queryKey: ['search_product', args],
    queryFn: fetchProducts,
    select: data => ({
      pageParams: data.pageParams,
      pages: data.pages.flatMap(page =>
        page.productCollection.items.map(item => ({
          name: item.name,
          image: item.image.url,
          slug: item.slug,
          id: item.sys.id,
        }))
      ),
    }),
    getNextPageParam: lastPage => {
      const { total, limit, skip } = lastPage.productCollection
      const nextPage = skip + limit
      if (nextPage >= total) return
      return nextPage
    },
  })
}

const fetchProducts: QueryFunction<ProductQuery, QueryKey> = async ({
  queryKey,
  pageParam = 0,
}) => {
  const { term, limit, locale } = queryKey[1]
  const res = await searchProducts({
    term,
    limit,
    locale,
    skip: pageParam,
  })
  return res
}

async function searchProducts({ term, limit, locale, skip }: QueryArgs) {
  const { data } = await client.query<ProductQuery>({
    query: SEARCH_PRODUCTS,
    variables: {
      term,
      locale,
      limit,
      skip,
    },
  })
  return data
}

import type { NextApiHandler } from 'next'
import { client } from '@services/client'
import { GET_PRODUCT } from '@services/queries'

type GetProduct = {
  slug: string
}

async function getProduct({ slug }: GetProduct) {
  const { data } = await client.query<ProductData>({
    query: GET_PRODUCT,
    variables: {
      slug,
      preview: true,
    },
  })

  const product = data.productCollection.items[0]

  if (!product) {
    throw new Error(`Product not found: ${slug}`)
  }

  return product
}

const previewHandler: NextApiHandler = async (req, res) => {
  const slug = req.query.slug

  if (
    req.query.secret !== process.env.PREVIEW_SECRET ||
    typeof slug !== 'string' ||
    !slug
  ) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    const product = await getProduct({ slug })
    res.setPreviewData({})
    res.redirect(`/products/${product.slug}`)
  } catch (e) {
    return res.status(500).json({ message: 'Internal error' })
  }
}

export default previewHandler

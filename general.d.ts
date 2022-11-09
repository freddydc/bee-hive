type Image = {
  url: string
}

type ID = {
  id: string
}

type Items<T> = {
  items: Array<T>
}

type Product = {
  name: string
  image: string
  slug: string
  id: string
}

type ProductData = {
  productCollection: Items<{
    slug: string
    name: string
    image: Image
    sys: ID
  }>
}

type Seller = {
  id: string
  description: string
  manage: string
  image: string
  name: string
}

type SellerStack = {
  sellerCollection: Items<
    Omit<Seller, 'id' | 'image'> & { sys: ID; image: Image }
  >
}

type ProductsBySellerStack = {
  productCollection: Items<
    Omit<Product, 'id' | 'image'> & { sys: ID; image: Image }
  >
}

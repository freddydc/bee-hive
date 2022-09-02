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

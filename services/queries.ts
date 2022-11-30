import { gql } from '@apollo/client'

const PRODUCT_FIELDS = gql`
  fragment ProductFields on Product {
    name
    slug
    image {
      url
    }
    sys {
      id
    }
  }
`

export const GET_PRODUCTS = gql`
  ${PRODUCT_FIELDS}

  query GetProductCollection($limit: Int = 10, $locale: String) {
    productCollection(limit: $limit, locale: $locale) {
      items {
        ...ProductFields
      }
    }
  }
`

export const GET_PRODUCT = gql`
  ${PRODUCT_FIELDS}

  query GetProductCollection(
    $slug: String!
    $preview: Boolean = false
    $locale: String
  ) {
    productCollection(
      limit: 1
      where: { slug: $slug }
      preview: $preview
      locale: $locale
    ) {
      items {
        ...ProductFields
      }
    }
  }
`

export const GET_PRODUCTS_BY_SELLER = gql`
  ${PRODUCT_FIELDS}
  query GetProductCollection($sellerId: String!, $limit: Int = 10) {
    productCollection(
      limit: $limit
      where: { seller: { sys: { id: $sellerId } } }
    ) {
      items {
        ...ProductFields
      }
    }
  }
`

const SELLER_FIELDS = gql`
  fragment SellerFields on Seller {
    name
    manage
    description
    image {
      url
    }
    sys {
      id
    }
  }
`

export const GET_SELLERS = gql`
  ${SELLER_FIELDS}
  query GetSellerCollection($limit: Int = 10) {
    sellerCollection(limit: $limit) {
      items {
        ...SellerFields
      }
    }
  }
`

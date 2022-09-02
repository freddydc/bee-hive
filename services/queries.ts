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

  query GetProductCollection($limit: Int = 10) {
    productCollection(limit: $limit) {
      items {
        ...ProductFields
      }
    }
  }
`

export const GET_PRODUCT = gql`
  ${PRODUCT_FIELDS}

  query GetProductCollection($slug: String!) {
    productCollection(limit: 1, where: { slug: $slug }) {
      items {
        ...ProductFields
      }
    }
  }
`

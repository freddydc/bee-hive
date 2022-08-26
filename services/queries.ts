import { gql } from '@apollo/client'

const PRODUCT_FIELDS = gql`
  fragment ProductFields on Product {
    name
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

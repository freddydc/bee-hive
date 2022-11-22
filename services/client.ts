import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const apiLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
  },
})

const authLink = setContext((req, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${process.env.PREVIEW_ACCESS_TOKEN}`,
    },
  }
})

export const client = new ApolloClient({
  link: authLink.concat(apiLink),
  cache: new InMemoryCache(),
})

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

type QueryProps = {
  children: React.ReactNode
}

const client = new QueryClient()

export function QueryProvider({ children }: QueryProps) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

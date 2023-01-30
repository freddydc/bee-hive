import '@styles/general.css'
import { QueryProvider } from '@components/QueryProvider'
import type { AppProps } from 'next/app'

function App({ Component, pageProps }: AppProps) {
  return (
    <QueryProvider>
      <Component {...pageProps} />
    </QueryProvider>
  )
}

export default App

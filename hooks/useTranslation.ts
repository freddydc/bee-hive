import { useRouter } from 'next/router'
import es from '@public/locales/es.json'
import en from '@public/locales/en.json'

const LOCALES = {
  es,
  en,
}

export function useTranslation() {
  const { locale } = useRouter()
  const language = LOCALES[locale as 'es' | 'en']
  return language
}

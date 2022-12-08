import type { NextApiHandler, NextApiResponse } from 'next'
import { CookieSerializeOptions, serialize } from 'cookie'

const PREFER_LOCALE_COOKIE = 'NEXT_LOCALE'

const handleLanguage: NextApiHandler = (req, res) => {
  if (req.method === 'GET') {
    const preferLocale = req.cookies[PREFER_LOCALE_COOKIE] ?? ''
    res.status(200).json({
      preferLocale,
    })
    return
  }

  if (req.method === 'POST') {
    const preferLocale = req.body.preferLocale
    setCookie(res, PREFER_LOCALE_COOKIE, preferLocale, {
      path: '/', // NEXT_LOCALE cookie must be set to the `/` path
      maxAge: 604800,
    })
    res.end()
    return
  }

  res.status(405).end()
}

function setCookie(
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) {
  const strValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value)

  if (typeof options.maxAge === 'number') {
    options.expires = new Date(Date.now() + options.maxAge * 1000)
  }

  res.setHeader('Set-Cookie', serialize(name, strValue, options))
}

export default handleLanguage

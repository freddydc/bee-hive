import type { NextApiHandler } from 'next'

const exitPreview: NextApiHandler = (req, res) => {
  res.clearPreviewData()
  // (307) Temporary redirect to home
  res.redirect('/')
  res.end()
}

export default exitPreview

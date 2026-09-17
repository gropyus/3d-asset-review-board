import { createApp } from './app.js'

const port = Number(process.env.PORT ?? 8080)

createApp().listen(port, () => {
  console.log(`review-api listening on http://localhost:${port}`)
})

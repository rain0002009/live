import crypto from 'crypto'
import express from 'express'
import bodyParser from 'body-parser'
import ffmpeg from 'fluent-ffmpeg'

const app = express()
const folder = 'static/.cache'
app.use(bodyParser.json())
app.post('/server-middleware', (req, response) => {
  const { url } = req.body
  const filename = crypto.createHash('sha256').update(url).digest('hex') + '.png'
  ffmpeg(url, { timeout: 8 })
    .noAudio()
    .on('end', () => {
      response.json({ status: 200, file: '/.cache/' + filename })
    })
    .on('error', (err: any) => {
      response.json({ status: 500, message: err.message })
    })
    .screenshot({
      filename,
      timestamps: ['00:00'],
      count: 1,
      folder
    })
})

export default app

import path from 'path'
import fs from 'fs/promises'
import crypto from 'crypto'
import express from 'express'
import bodyParser from 'body-parser'
import ffmpeg from 'fluent-ffmpeg'
import cron from 'node-cron'
import glob from 'glob'
import consola from 'consola'

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

function clearCache () {
  consola.info('开始清除图片缓存')
  const imgs = glob.sync(path.resolve(__dirname, '../static/.cache/*.png'))
  imgs.forEach(async (png) => {
    try {
      await fs.rm(png, { force: true })
    } catch (e) {
      consola.error(e)
    }
  })
}
clearCache()
const task = cron.schedule('0 */6 * * *', clearCache)

task.start()

export default app

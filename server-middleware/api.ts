import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'

const app = express()

app.use(bodyParser.json())
app.post('/server-middleware', (req, response) => {
  const { url } = req.body
  axios.head(url, { timeout: 5000 })
    .then((res) => {
      response.json({ status: res.status })
    })
    .catch(() => {
      response.json({ status: 500 })
    })
})

export default app

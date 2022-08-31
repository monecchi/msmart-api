import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

// Tuya Api Routes
import { routes } from './routes/index.js'

dotenv.config()
const hostname = process.env.NODE_ENV !== 'development' ? process.env.HOSTNAME : 'localhost'
const port = process.env.NODE_ENV !== 'development' ? process.env.PORT : 5000

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '32mb' }))

app.use(cors({ origin: '*' }))
app.use(
  cors({
    origin: [
      'https://openapi.tuyaeu.com',
      'https://openapi.tuyaus.com',
      'https://msmart.meurancho.pizza'
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Origin',
      'Content-Type',
      'Content-Length',
      'sign',
      'sign_method',
      'client_id',
      'access_token',
      't',
      'nonce',
      'stringToSign',
      'Signature-Headers'
    ]
  })
)

app.use(routes)

app.listen(port, hostname, () => {
  const protocol = (process.env.NODE_ENV !== 'development') ? 'https' : 'http'
  console.log(
    `tuyaApi Started ✓ - server running at ${protocol}://${hostname}:${port}`
  )
})

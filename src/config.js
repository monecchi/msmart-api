import dotenv from 'dotenv'
dotenv.config()

// Tuya Cloud - IoT Platform
const config = {
  baseUrl: `${process.env.TUYA_DATA_CENTER_URL}`, // Western America Data Center - https://openapi.tuyaus.com
  basePath: '/v1.0',
  clientId: `${process.env.TUYA_CLIENT_ID}`, // Access ID / Client ID
  clientSecret: `${process.env.TUYA_CLIENT_SECRET}`, // Access Secret / Client Secret:
  uid: `${process.env.TUYA_UID}`,
  deviceId: `${process.env.TUYA_DEVICE_ID}`,
  imageUrl: `${process.env.TUYA_IMAGE_URL}`
}

if (!Object.values(config).every(Boolean)) {
  throw new Error(
    'Please create .env from .env.example and specify all values'
  )
}

export default config

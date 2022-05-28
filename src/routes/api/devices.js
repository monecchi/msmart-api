import express from 'express'
import axios from 'axios'

import { TuyaContext } from '@tuya/tuya-connector-nodejs'
import { RedisTokenStore } from '../../utils/tokenStore.js'
import Redis from 'ioredis'

import config from '../../config.js'
const router = express.Router()
const redis = new Redis({
  port: `${process.env.REDIS_PORT}`, // Redis port
  host: `${process.env.REDIS_HOST}`, // Redis host
  username: 'default', // needs Redis >= 6
  password: `${process.env.REDIS_PASS}`, // string
  db: 0 // Defaults to 0
})
const { baseUrl, clientId, clientSecret, deviceId } = config

//
// Devices API Routes
// Tuya Cloud Api Reference: https://developer.tuya.com/en/docs/iot/api-reference?id=Ka7qb7vhber64
// @see: https://github.com/tuya/tuya-connector-nodejs
//

//
// Post commands to device
//
router.post('/:id/commands', async (req, res) => {
  try {
    const deviceId = req.params.id
    const { commands } = req.body

    // if (!commands || commands === '' || !commands.length) {
    //   return res.status(400).json({ error: 'Missing body commands --> "commands": [{ "code": "", "value": ""}]' })
    // }

    const tuya = new TuyaContext({
      baseUrl: 'https://openapi.tuyaus.com',
      accessKey: clientId,
      secretKey: clientSecret,
      // store: new RedisTokenStore(redis),
      rpc: axios
    })

    const result = await tuya.request({
      method: 'POST',
      path: `/v1.0/devices/${deviceId}/commands`,
      body: { commands }
    })

    res.status(200).json({
      ...result,
      message: 'Device updated successfully!'
    })
  } catch (error) {
    console.log('ERROR', error)
  }
})

//
//
// Update (modify) device details, such as name etc..
//
router.put('/:id/update', async (req, res) => {
  try {
    const deviceId = req.params.id
    const update = req.body

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: 'Missing body params' })
    }

    const tuya = new TuyaContext({
      baseUrl: 'https://openapi.tuyaus.com',
      accessKey: clientId,
      secretKey: clientSecret,
      // store: new RedisTokenStore(redis),
      rpc: axios
    })

    const result = await tuya.request({
      method: 'PUT',
      path: `/v1.0/iot-03/devices/${deviceId}`,
      body: update
    })

    res.status(200).json({
      ...result,
      message: 'Device updated successfully!'
    })
  } catch (error) {
    console.log('ERROR', error)
  }
})

//
// Get device details, no request params
//
router.get('/', async (req, res) => {
  try {
    const tuya = new TuyaContext({
      baseUrl,
      accessKey: clientId,
      secretKey: clientSecret,
      store: new RedisTokenStore(redis),
      rpc: axios
    })

    const response = await tuya.request({
      method: 'GET',
      path: `/v1.0/devices/${deviceId}`
      // body: {},
    })

    res.status(200).json({
      ...response.result
    })
  } catch (error) {
    console.log('ERROR', error)
  }
})

//
// Get device details by id
//
router.get('/:id', async (req, res) => {
  try {
    const deviceId = req.params.id

    const tuya = new TuyaContext({
      baseUrl,
      accessKey: clientId,
      secretKey: clientSecret,
      store: new RedisTokenStore(redis),
      rpc: axios
    })

    const response = tuya.request({
      method: 'GET',
      path: `/v1.0/devices/${deviceId}`
      // body: {},
    })

    await response.then(result => {
      res.status(200).send(result)
    })
  } catch (error) {
    console.log('ERROR', error)
  }
})

//
// Get device available data points
//
router.get('/:id/status', async (req, res) => {
  try {
    const deviceId = req.params.id
    const tuya = new TuyaContext({
      baseUrl: 'https://openapi.tuyaus.com',
      accessKey: clientId,
      secretKey: clientSecret,
      store: new RedisTokenStore(redis),
      rpc: axios
    })

    const response = tuya.request({
      method: 'GET',
      path: `/v1.0/devices/${deviceId}/status`
      // body: {},
    })

    await response.then(result => {
      res.status(200).json(result)
    })
  } catch (error) {
    console.log('ERROR', error)
  }
})

//
// Get device available functions
//
router.get('/:id/functions', async (req, res) => {
  try {
    const deviceId = req.params.id
    const tuya = new TuyaContext({
      baseUrl: 'https://openapi.tuyaus.com',
      accessKey: clientId,
      secretKey: clientSecret,
      store: new RedisTokenStore(redis),
      rpc: axios
    })

    const response = tuya.request({
      method: 'GET',
      path: `/v1.0/iot-03/devices/${deviceId}/functions`
      // body: {},
    })

    await response.then(result => {
      res.status(200).send(result)
    })
  } catch (error) {
    console.log('ERROR', error)
  }
})

export { router as deviceRoutes }

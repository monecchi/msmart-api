import express from 'express'

import { deviceRoutes } from './devices.js'
const router = express.Router()

// Device routes
router.use('/devices', deviceRoutes)

export { router as apiRoutes }

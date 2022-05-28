import express from 'express'
import { apiRoutes } from './api/index.js'

// import config from '../config.js'
// const { apiUrl, apiPath } = config

const router = express.Router()

const api = '/api/v1'

// API Routes
router.use(api, apiRoutes)
router.use(api, (req, res) => res.status(404).json('No API route found'))

export { router as routes } // later on import { routes } from './routes/index.js' on inde.jx

// Redis (ioRedis) connection
import dotenv from 'dotenv'
dotenv.config()

export const redisConnect = {
  port: `${process.env.REDIS_PORT}`,
  host: `${process.env.REDIS_HOST}`,
  username: 'default',
  password: `${process.env.REDIS_PASS}`,
  db: 0
}

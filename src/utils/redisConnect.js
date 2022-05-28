import Redis from 'ioredis'

const redis = new Redis({
  port: `${process.env.REDIS_PORT}`,
  host: `${process.env.REDIS_HOST}`,
  username: 'default',
  password: redisPass,
  db: 0
})

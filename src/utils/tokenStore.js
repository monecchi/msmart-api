//
// redis store
// @see: https://github.com/tuya/tuya-connector-nodejs
//
import Redis from 'ioredis'
import { redisConnect } from '../utils/redisConnect.js'

// Ways to connect to Redis (remotely or locally)
// new Redis(); // Connect to 127.0.0.1:6379
// new Redis(6379); // 127.0.0.1:6379
// new Redis(6383, '104.XXX.XXX.XXX');
// new Redis('/etc/easypanel/projects/project-name/redis/redis/data)

// const redisPass = process.env.REDIS_PASS

// client = new Redis({
//   port: `${process.env.REDIS_PORT}`,
//   host: `${process.env.REDIS_HOST}`,
//   username: 'default',
//   password: redisPass,
//   db: 0
// })

export class RedisTokenStore {
  client = new Redis(redisConnect)

  constructor (client, key = 'tuya::token') {
    this.client = client
    this.key = key
  }

  async setTokens (tokens) {
    const res = await this.client.set(this.key, JSON.stringify(tokens))
    return !!res
  }

  async getAccessToken () {
    const jsonStr = (await this.client.get(this.key)) || '{}'
    const tokens = JSON.parse(jsonStr)
    return tokens && tokens.access_token
  }

  async getRefreshToken () {
    const jsonStr = (await this.client.get(this.key)) || '{}'
    const tokens = JSON.parse(jsonStr)
    return tokens.refresh_token
  }
}

// @Usage - index.ts
// import { RedisTokenStore } from './tokenStore'
// import IoRedis from 'ioredis'
// const redis = new IoRedis()

// const tuya = new TuyaContext({
//   baseUrl: 'https://openapi.tuyaus.com',
//   accessKey: 'xx',
//   secretKey: 'xx',
//   store: new RedisTokenStore(redis)
// })

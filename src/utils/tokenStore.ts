//
// redis store
// @see: https://github.com/tuya/tuya-connector-nodejs
//
import {
  TuyaTokenStorInterface,
  TuyaTokensSave,
} from '@tuya/tuya-connector-nodejs';
import Redis from 'ioredis';
//import IORedis from 'ioredis';

// Ways to connect to Redis (remotely or locally)
//new Redis(); // Connect to 127.0.0.1:6379
//new Redis(6388); // 127.0.0.1:6388
//new Redis(6388, '104.207.147.229'); // 104.207.147.229:6388
//new Redis('/etc/easypanel/projects/msmart-tuya-api/redis/redis/data);

const redisPass: string = 'M@smart$Redis#3065'; //encodeURIComponent('M@smart$Redis#3065');

// new Redis({
//   port: 6388, // Redis port
//   host: '104.207.147.229', // Redis host
//   username: 'default', // needs Redis >= 6
//   password: redisPass,
//   db: 0, // Defaults to 0
// });

export class RedisTokenStore implements TuyaTokenStorInterface {
  private readonly client: Redis = new Redis({
    port: 6388, // Redis port
    host: '104.207.147.229', // Redis host
    username: 'default', // needs Redis >= 6
    password: redisPass,
    db: 0, // Defaults to 0
  });
  private readonly key: string;
  constructor(client: Redis, key: string = 'tuya::token') {
    this.client = client;
    this.key = key;
  }

  async setTokens(tokens: TuyaTokensSave): Promise<boolean> {
    const res = await this.client.set(this.key, JSON.stringify(tokens));
    return !!res;
  }
  async getAccessToken(): Promise<string | undefined> {
    const jsonStr = (await this.client.get(this.key)) || '{}';
    const tokens: TuyaTokensSave = JSON.parse(jsonStr);
    return tokens && tokens.access_token;
  }
  async getRefreshToken(): Promise<string | undefined> {
    const jsonStr = (await this.client.get(this.key)) || '{}';
    const tokens: TuyaTokensSave = JSON.parse(jsonStr);
    return tokens.refresh_token;
  }
}

// @Usage - index.ts
// import { RedisTokenStore } from './tokenStore';
// import IoRedis from 'ioredis';
// const redis = new IoRedis();

// const tuya = new TuyaContext({
//   baseUrl: 'https://openapi.tuyaus.com',
//   accessKey: 'xx',
//   secretKey: 'xx',
//   store: new RedisTokenStore(redis),
// });

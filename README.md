# mSmart API

## What is mSmart API?

`msmart-tuya-api-server` provides a set of HTTP APIs to connect to Tuya compatible smart devices over the cloud. It is as fancy as a simple Node.js / Express server built around **[tuya-connector](https://github.com/tuya/tuya-connector-nodejs)**, which helps you quickly connect to Tuya's Cloud Platform.

Initially, I've set it up to work only with Tuya, but any HTTP APIs could be implemented.

[Tuya Open Platform—API Reference](https://developer.tuya.com/en/docs/iot/api-reference?id=Ka7qb7vhber64)

### Motivation

I wanted an easy to use / setup `Nodejs` REST API serving as a Hub to discover and control all Tuya compatible devices under a user's account (Tuya app account or Smart Life App Account) on the cloud.

### Development

A few environment variables are required, there's an `env.example` where
It's recommended to have **redis** running locally or remotely (own server or service), as the project uses **[ioredis](https://github.com/luin/ioredis)**

```bash
git clone https://github.com/monecchi/msmart-api.git

# install dependecies
yarn install
```

### Deployment

### Get started

```ts
import { TuyaContext  } from '@tuya/tuya-connector-nodejs';

const tuya = new TuyaContext({
  baseUrl: 'https://openapi.tuyacn.com',
  accessKey: 'xx',
  secretKey: 'xx',
});

const device = await tuya.device.detail({
  device_id: 'device_id'
});

```

## Advanced development

### Custom `tokenStore`

By default, `tokenStore` is implemented based on memory. We recommend that you implement the store instance in your service. In the following code block, the Redis Store is used as an example.

```ts
// tokenStore.ts
import { TuyaTokenStorInterface, TuyaTokensSave } from '@tuya/tuya-connector-nodejs';
import IORedis from 'ioredis';

export class RedisTokenStore implements TuyaTokenStorInterface {
  private readonly client: IORedis.Redis;
  private readonly key: string;
  constructor(client: IORedis.Redis, key: string = 'tuya::token') {
    this.client = client;
    this.key = key;
  }

  async setTokens(tokens: TuyaTokensSave): Promise<boolean> {
    const res = await this.client.set(this.key, JSON.stringify(tokens));
    return ! ! res;
  }
  async getAccessToken(): Promise<string | undefined> {
    const jsonStr = await this.client.get(this.key) || '{}';
    const tokens: TuyaTokensSave = JSON.parse(jsonStr);
    return tokens && tokens.access_token;
  }
  async getRefreshToken(): Promise<string | undefined> {
    const jsonStr = await this.client.get(this.key) || '{}';
    const tokens: TuyaTokensSave = JSON.parse(jsonStr);
    return tokens.refresh_token;
  }
}

// index.ts
import { RedisTokenStore } from './tokenStore';
import IoRedis from 'ioredis';
const redis = new IoRedis();

const tuya = new TuyaContext({
  baseUrl: 'https://openapi.tuyacn.com',
  accessKey: 'xx',
  secretKey: 'xx',
  store: new RedisTokenStore(redis),
});
```

### Custom request of `httpClient`

`tuya-connector` uses Axios as `httpClient` by default, and exposes replaceable parameters. If necessary, you can also customize `httpClient`.

```ts
import axios from 'axios';
import { TuyaContext  } from '@tuya/tuya-connector-nodejs';

const tuya = new TuyaContext({
  baseUrl: 'https://openapi.tuyacn.com',
  accessKey: 'xx',
  secretKey: 'xx',
  rpc: axios
});
```

### Requests of other OpenAPIs

`tuya-connector` encapsulates common APIs, and declares the types of request and response parameters. You can customize additional API requests.

```ts
import { TuyaContext  } from '@tuya/tuya-connector-nodejs';

const tuya = new TuyaContext({
  baseUrl: 'https://openapi.tuyacn.com',
  accessKey: 'xx',
  secretKey: 'xx',
});

const { data } = await tuya.request({
  method: 'GET',
  path: '/v1.0/xx',
  body: {},
});
```

### Other issues

1. Apply for an authorization key. On the [platform](https://iot.tuya.com/cloud/), you can create a project to get the access ID and access secret of the cloud application.

2. For more information about global error codes, see [Global Error Codes](https://developer.tuya.com/en/docs/iot/error-code?id=K989ruxx88swc).

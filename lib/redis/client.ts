import Redis from 'ioredis'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

class RedisCacheManager {
  private client: Redis | null = null
  private memoryCache = new Map<string, { value: string; expiresAt: number }>()
  private isConnected = false

  constructor() {
    try {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 2,
        retryStrategy(times) {
          if (times > 3) {
            return null // Stop retrying and fallback
          }
          return Math.min(times * 100, 1000)
        },
        lazyConnect: true,
      })

      this.client.connect().then(() => {
        this.isConnected = true
        console.log('[Redis] Connected to Redis at', redisUrl)
      }).catch((err) => {
        console.warn('[Redis] Connection failed, using in-memory fallback:', err.message)
        this.isConnected = false
      })

      this.client.on('error', (err) => {
        // Silently handle error so dev continues with memory cache
        this.isConnected = false
      })
    } catch {
      this.isConnected = false
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.isConnected && this.client) {
      try {
        const raw = await this.client.get(key)
        return raw ? (JSON.parse(raw) as T) : null
      } catch {
        // Fallback to memory
      }
    }

    const item = this.memoryCache.get(key)
    if (!item) return null
    if (Date.now() > item.expiresAt) {
      this.memoryCache.delete(key)
      return null
    }
    return JSON.parse(item.value) as T
  }

  async set(key: string, value: unknown, ttlSeconds = 3600): Promise<void> {
    const serialized = JSON.stringify(value)

    if (this.isConnected && this.client) {
      try {
        await this.client.set(key, serialized, 'EX', ttlSeconds)
        return
      } catch {
        // Fallback to memory
      }
    }

    this.memoryCache.set(key, {
      value: serialized,
      expiresAt: Date.now() + ttlSeconds * 1000,
    })
  }

  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttlSeconds = 3600): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null && cached !== undefined) {
      return cached
    }

    const fresh = await fetcher()
    await this.set(key, fresh, ttlSeconds)
    return fresh
  }

  getStatus() {
    return {
      connected: this.isConnected,
      url: redisUrl,
      memoryKeys: this.memoryCache.size,
    }
  }
}

export const redisCache = new RedisCacheManager()

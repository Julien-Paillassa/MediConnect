import { RateLimiterMemory } from 'rate-limiter-flexible'

const opts = {
  points: 5,
  // duration: 30 * 24 * 60 * 60 // Per month
  duration: 30 // Per month
}

const optsBasic = {
  points: 10,
  duration: 30
}

const optsPro = {
  points: 15,
  duration: 30
}

const optsEnterprise = {
  points: 20,
  duration: 60
}

export const rateLimiters: Record<string, RateLimiterMemory> = {
  Basic: new RateLimiterMemory(optsBasic),
  Pro: new RateLimiterMemory(optsPro),
  Enterprise: new RateLimiterMemory(optsEnterprise),
  default: new RateLimiterMemory(opts)
}

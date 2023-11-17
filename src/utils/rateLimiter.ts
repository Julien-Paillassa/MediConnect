import { RateLimiterMemory } from 'rate-limiter-flexible'

const opts = {
  points: 6,
  // duration: 30 * 24 * 60 * 60 // Per month
  duration: 30 // Per month
}

const optsFree = {
  points: 10,
  duration: 30
}

const optsPro = {
  points: 20,
  duration: 30
}

const optsEnterprise = {
  points: 30,
  duration: 60
}

export const rateLimiters: Record<string, RateLimiterMemory> = {
  Free: new RateLimiterMemory(optsFree),
  Pro: new RateLimiterMemory(optsPro),
  Enterprise: new RateLimiterMemory(optsEnterprise),
  default: new RateLimiterMemory(opts)
}

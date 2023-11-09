import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 min
  limit: 5,
  message: 'You can only make 5 requests every 2 min !!',
  standardHeaders: 'draft-7',
  legacyHeaders: false
})

export const limiterBasic = rateLimit({
  /* windowMs: 30 * 1440 * 60 * 1000, // 30 jours
  limit: 500, */
  windowMs: 2 * 60 * 1000,
  limit: 10,
  message: 'Your subcription is Basic. You can only make 500 requests per month !!',
  standardHeaders: 'draft-7',
  legacyHeaders: false
})

export const limiterPro = rateLimit({
  /* windowMs: 30 * 1440 * 60 * 1000, // 30 jours
  limit: 1000, */
  windowMs: 2 * 60 * 1000,
  limit: 15,
  message: 'Your subcription is Pro. You can only make 1000 requests per month !!',
  standardHeaders: 'draft-7',
  legacyHeaders: false
})

export const limiterEnterprise = rateLimit({
  /* windowMs: 30 * 1440 * 60 * 1000, // 30 jours
  limit: 10000, */
  windowMs: 2 * 60 * 1000,
  limit: 20,
  message: 'Your subcription is Entreprise. You can only make 10000 requests per month !!',
  standardHeaders: 'draft-7',
  legacyHeaders: false
})

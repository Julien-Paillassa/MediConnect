import express, { Router } from 'express'
import * as StripeController from '../controllers/webhook.controller'

const router = Router()

/**
 * @swagger
 * tags:
 *   - name: Webhook
 */

/**
 * @swagger
 * /webhooks/stripe:
 *   post:
 *     tags: ['Webhook']
 *     summary: Handle Stripe webhook
 *     description: Endpoint for Stripe to send webhook events
 *     responses:
 *       200:
 *         description: Successfully handled webhook
 */

router.post('/stripe', express.raw({ type: 'application/json' }), StripeController.stripe)

export default router

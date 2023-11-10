import express from 'express'
import * as UserSubscriptionController from '../controllers/user-subscription.controller'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Subscription
 *     description: Subscription management
 */

/**
 * @swagger
 * /user-subscription:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     tags: ['Subscription']
 *     summary: Create a payment checkout session
 *     description: Initiates a new payment checkout session for subscription
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               priceId:
 *                 type: string
 *                 description: The priceId of the subscription plain
 *                 example: price_1O826qCuQ03psKfd90pC4r80
 *     responses:
 *       200:
 *         description: Successfully created a checkout session
 */
router.post('/', UserSubscriptionController.create)

/**
 * @swagger
 * /user-subscription/webhook:
 *   post:
 *     tags: ['Subscription']
 *     summary: Handle Stripe webhook
 *     description: Endpoint for Stripe to send webhook events
 *     responses:
 *       200:
 *         description: Successfully handled webhook
 */
router.post('/webhook', UserSubscriptionController.webhook)

export default router

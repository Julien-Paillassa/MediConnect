import express from 'express'
import * as SubscriptionController from '../controllers/subscription.controller'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Subscription
 *     description: Subscription management
 */

/**
 * @swagger
 * /subscription:
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
 *               planId:
 *                 type: string
 *                 description: The id (stripe's price id) of the subscription plan
 *                 example: price_1OCpwpIoREqLVWCHxeAiU2mj
 *     responses:
 *       200:
 *         description: Successfully created a checkout session
 */
router.post('/', SubscriptionController.create)

export default router

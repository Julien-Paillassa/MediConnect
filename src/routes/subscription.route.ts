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

/**
 * @swagger
 * /subscription:
 *   put:
 *     security:
 *       - BearerAuth: []
 *     tags: ['Subscription']
 *     summary: Change subscription plan
 *     description: Change the subscription plan for the current user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPlanId:
 *                 type: string
 *                 description: The ID of the new subscription plan
 *                 example: price_1OCpwpIoREqLVWCHxeAiU2mj
 *     responses:
 *       200:
 *         description: Subscription successfully updated
 *       400:
 *         description: Invalid input or unable to change subscription
 */
router.put('', SubscriptionController.change) // Assurez-vous que la méthode 'change' existe dans SubscriptionController

export default router

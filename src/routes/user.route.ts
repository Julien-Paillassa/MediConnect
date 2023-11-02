import { Router } from 'express'
import * as UserController from '../controllers/user.controller'

const router = Router()

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User management
 */

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *         description: Unique identifier representing a specific user
 *         example: 2
 *       name:
 *         type: string
 *         description: name of the user
 *         example: Krishna
 *       email:
 *         type: string
 *         description: email of the user
 *         required: true
 *         example: test@gmail.com
 *       password:
 *         type: string
 *         description: password of the user
 *         required: true
 *         example: "1234"
 *   Error:
 *     type: object
 *     properties:
 *        message:
 *           type: string
 *        error:
 *           type: boolean
 *           default: true
 */

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     tags: ['User']
 *     summary: Update an user
 *     description: Update an user
 *     parameters:
 *       - id: id
 *         in: path
 *         description: User id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *                 example: Tutu
 *               email:
 *                 type: string
 *                 description: User's email
 *                 example: Tutu@gmail.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: poiuyt
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.put('/', UserController.update)

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     tags: ['User']
 *     summary: Delete an User
 *     description: Delete an User
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User's id
 *         required: true
 *     responses:
 *       204:
 *         description: The API key has been deleted
 *       404:
 *         description: API key not found
 */
router.delete('/', UserController.remove)

export default router

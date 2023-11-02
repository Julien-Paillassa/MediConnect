import { Router } from 'express'
import * as AuthController from '../controllers/auth.controller'

const router = Router()

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication
 */

/**
 * @swagger
 * definitions:
 *   Auth:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *         example: test@gmail.com
 *       password:
 *         type: string
 *         example: "1234"
 *   Token:
 *    type: object
 *    properties:
 *      email:
 *        type: string
 *        example: test@gmail.com
 *      token:
 *        type: string
 *        example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE1MDk5ODg2NDZ9.1zTKAzXmuyQDHw4uJXa324fFS1yZwlriFSppvK6nOQY
 *   Error:
 *      type: object
 *      properties:
 *         message:
 *            type: string
 *         error:
 *            type: boolean
 *            default: true
 *
 */

/**
 * @swagger
 * /auth/signUp:
 *   post:
 *     tags: ['User']
 *     summary: Create a new user
 *     description: Create a new user
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
 *                 example: Toto
 *               email:
 *                 type: string
 *                 description: User's email
 *                 example: Toto@gmail.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: azerty
 *     responses:
 *       201:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post('/signUp', AuthController.signUp)

/**
 * @swagger
 * /auth/singIn:
 *   post:
 *     tags:
 *       - authentication
 *     summary: Authenticate a user and receive a JWT Token
 *     description:
 *     operationId: login
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Login'
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *            $ref: '#/definitions/Token'
 *       400:
 *         description: Invalid username/password
 *         schema:
 *            $ref: '#/definitions/Error'
 *       404:
 *         description: User not found
 *         schema:
 *            $ref: '#/definitions/Error'
 */

router.post('/signIn', AuthController.signIn)

export default router

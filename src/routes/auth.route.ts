import express, { type Router } from 'express'
import * as AuthController from '../controllers/auth.controller'

const router: Router = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User authentication
 */

/**
 * @swagger
 * definitions:
 *   Login:
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
 * /auth/sign-up:
 *   post:
 *     tags: ['Auth']
 *     summary: Create a new user
 *     description: Create a new user with address
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
 *                 example: julien.paillassa@gmail.com
 *               password:
 *                 type: string
 *                 description: User's password. Must be at least 8 characters long and include at least one uppercase letter, one digit, and one special character (e.g., !@#$%^&*).
 *                 pattern: '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$'
 *                 example: Azerty!9
 *               address:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     description: Adresse's city
 *                     example: Brothers
 *                   country:
 *                     type: string
 *                     description: Adresse's country
 *                     example: US
 *                   line1:
 *                     type: string
 *                     description: Adresse's line1
 *                     example: 27 Fredrick Ave
 *                   postal_code:
 *                     type: string
 *                     description: Adresse's postal_code
 *                     example: 97712
 *                   state:
 *                     type: string
 *                     description: Adresse's state
 *                     example: CA
 *     responses:
 *       201:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/User'
 */
router.post('/sign-up', AuthController.signUp)

/**
 * @swagger
 * /auth/sign-in:
 *   post:
 *     tags: ['Auth']
 *     summary: Authenticate a user and receive a JWT Token
 *     description: Log a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *                 example: julien.paillassa@gmail.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: azerty
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

router.post('/sign-in', AuthController.signIn)

export default router

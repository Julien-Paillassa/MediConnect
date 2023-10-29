import { Router } from 'express'
import * as ApiKeyController from '../controllers/api-key.controller'

const router = Router()

/**
 * @swagger
 * tags:
 *   - name: Api Key
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ApiKey:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - key
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the API key
 *         name:
 *           type: string
 *           description: The name of the API key
 *         key:
 *           type: string
 *           description: The auto-generated key of the API key
 *       example:
 *         id: 1
 *         name: My API Key
 *         key: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
 */

/**
 * @swagger
 * /api-keys:
 *   get:
 *     tags: ['Api Key']
 *     summary: Retrieve user's API keys
 *     description: Retrieve user's API keys
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: number
 *         description: The page number
 *       - name: size
 *         in: query
 *         schema:
 *           type: number
 *         description: The page size
 *       - name: name
 *         in: query
 *         schema:
 *           type: string
 *         description: The name of the API key
 *     responses:
 *       200:
 *         description: A list of API keys
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ApiKey'
 *                 count:
 *                   type: number
 *                   description: The number of items in the current page
 *                   example: 1
 *                 page:
 *                   type: number
 *                   description: The current page number
 *                   example: 0
 *                 total:
 *                   type: number
 *                   description: The total number of items
 *                   example: 1
 */
router.get('/', ApiKeyController.list)

/**
 * @swagger
 * /api-keys:
 *   post:
 *     tags: ['Api Key']
 *     summary: Create a new API key
 *     description: Create a new API key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the API key
 *                 example: My API Key
 *     responses:
 *       201:
 *         description: The created API key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiKey'
 */
router.post('/', ApiKeyController.create)

/**
 * @swagger
 * /api-keys/{id}:
 *   put:
 *     tags: ['Api Key']
 *     summary: Update an API key
 *     description: Update an API key
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The API key id
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
 *                 description: The name of the API key
 *                 example: My API Key second name
 *     responses:
 *       200:
 *         description: The updated API key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiKey'
 *       404:
 *         description: API key not found
 */
router.put('/:id', ApiKeyController.update)

/**
 * @swagger
 * /api-keys/{id}:
 *   delete:
 *     tags: ['Api Key']
 *     summary: Delete an API key
 *     description: Delete an API key
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The API key id
 *         required: true
 *     responses:
 *       204:
 *         description: The API key has been deleted
 *       404:
 *         description: API key not found
 */
router.delete('/:id', ApiKeyController.remove)

export default router

import { Router } from 'express'
import * as GenericController from '../controllers/generic.controller'

const router = Router()

/**
 * @swagger
 * tags:
 *   - name: Generic
 *     description: Retrieve an API key and set it as a cookie through your browser console `document.cookie = 'X-API-KEY=your-api-key;path=/;'`
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Generic:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the generic
 *         name:
 *           type: string
 *           description: The name of the generic
 *       example:
 *         id: 1
 *         name: paracétamol
 */

/**
 * @swagger
 * /generics:
 *   get:
 *     tags: ['Generic']
 *     summary: Retrieve a list of generics
 *     description: Retrieve a list of generics.
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
 *         description: The filter on the name
 *     responses:
 *       200:
 *         description: A list of generics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Generic'
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
 *       401:
 *         $ref: '#/components/responses/MissingOrInvalidApiKeyError'
 */
router.get('/', GenericController.list)

/**
 * @swagger
 * /generics/{id}:
 *   get:
 *     tags: ['Generic']
 *     summary: Retrieve a generic
 *     description: Retrieve a generic by id
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id of the generic
 *         required: true
 *     responses:
 *       200:
 *         description: A generic
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Generic'
 *       401:
 *         $ref: '#/components/responses/MissingOrInvalidApiKeyError'
 *       404:
 *         description: Generic not found
 */
router.get('/:id', GenericController.get)

export default router

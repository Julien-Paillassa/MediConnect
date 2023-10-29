import { Router } from 'express'
import * as DrugGenericController from '../controllers/drug-generic.controller'

const router = Router()

/**
 * @swagger
 * tags:
 *   - name: Drug Generic
 *     description: Retrieve an API key and set it as a cookie through your browser console `document.cookie = 'X-API-KEY=your-api-key;path=/;'`
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DrugGeneric:
 *       type: object
 *       required: true
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the drug generic
 *         drugId:
 *           type: number
 *           description: The id of the related drug
 *         genericId:
 *           type: string
 *           description: The id of the related generic
 *         type:
 *           type: string
 *           description: The generic type of the drug
 *           enum:
 *             - 'Princeps'
 *             - 'Generic'
 *             - 'Generic by posology'
 *             - 'Generic substituable'
 *         rank:
 *           type: string
 *           description: The rank of the drug within its generic
 *       example:
 *         id: 1368
 *         drugId: 294
 *         genericId: 1
 *         type: 1
 *         rank: 5
 */

/**
 * @swagger
 * /drug-generics:
 *   get:
 *     tags: ['Drug Generic']
 *     summary: Retrieve a list of drug generics
 *     description: Retrieve a list of drug generics.
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
 *       - name: drugId
 *         in: query
 *         schema:
 *           type: number
 *         description: The id of the related drug
 *       - name: genericId
 *         in: query
 *         schema:
 *           type: number
 *         description: The id of the related generic
 *       - name: type
 *         in: query
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - 'Princeps'
 *               - 'Generic'
 *               - 'Generic by posology'
 *               - 'Generic substituable'
 *         description: The filter on the generic type
 *       - name: rank
 *         in: query
 *         schema:
 *           type: string
 *         description: The rank of the drug
 *     responses:
 *       200:
 *         description: A list of drug generic informations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DrugGeneric'
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
router.get('/', DrugGenericController.list)

/**
 * @swagger
 * /drug-generics/{id}:
 *   get:
 *     tags: ['Drug Generic']
 *     summary: Retrieve a drug generic
 *     description: Retrieve a drug generic
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id of the drug generic
 *         required: true
 *     responses:
 *       200:
 *         description: A drug generic
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DrugGeneric'
 *       401:
 *         $ref: '#/components/responses/MissingOrInvalidApiKeyError'
 *       404:
 *         description: Drug generic not found
 */
router.get('/:id', DrugGenericController.get)

export default router

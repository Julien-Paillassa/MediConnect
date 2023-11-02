import { Router } from 'express'
import * as DrugCompositionController from '../controllers/drug-composition.controller'

const router = Router()

/**
 * @swagger
 * tags:
 *   - name: Drug Composition
 *     description: Retrieve an API key and set it as a cookie through your browser console `document.cookie = 'X-API-KEY=your-api-key;path=/;'`
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DrugComposition:
 *       type: object
 *       required: true
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the drug composition
 *         drugId:
 *           type: number
 *           description: The id of the related drug
 *         name:
 *           type: string
 *           description: The name of the composition
 *         substanceCode:
 *           type: number
 *           description: The substance code
 *         substanceName:
 *           type: string
 *           description: The substance name
 *         substanceDosage:
 *           type: string
 *           description: The substance dosage
 *         substanceDosageReference:
 *           type: string
 *           description: The substance dosage reference
 *         substanceNature:
 *           type: string
 *           description: The substance nature (SA: Active substance, FT: Theurapeutic moiety)
 *           enum:
 *             - 'SA'
 *             - 'FT'
 *         substancesLinkNumber:
 *           type: number
 *           description: TODO
 *       example:
 *         id: 33129
 *         drugId: 60234100
 *         name: comprimé
 *         substanceCode: 02202
 *         substanceName: PARACÉTAMOL
 *         substanceDosage: 1000 mg
 *         substanceDosageReference: un comprimé
 *         substanceNature: SA
 *         substancesLinkNumber: 1
 */

/**
 * @swagger
 * /drug-compositions:
 *   get:
 *     tags: ['Drug Composition']
 *     summary: Retrieve a list of drug compositions
 *     description: Retrieve a list of drug compositions.
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
 *       - name: sort
 *         in: query
 *         schema:
 *           type: string
 *         description: The field to sort on
 *       - name: order
 *         in: query
 *         schema:
 *           type: string
 *         description: The order to sort on (ASC or DESC)
 *       - name: name
 *         in: query
 *         schema:
 *           type: string
 *         description: The filter on the name
 *       - name: drugId
 *         in: query
 *         schema:
 *           type: string
 *         description: The filter on the drug id
 *       - name: substanceCode
 *         in: query
 *         schema:
 *           type: string
 *         description: The filter on the substance code
 *       - name: substanceName
 *         in: query
 *         schema:
 *           type: string
 *         description: The filter on the substance name
 *       - name: substanceDosage
 *         in: query
 *         schema:
 *           type: string
 *         description: The filter on the substance dosage
 *       - name: substanceDosageReference
 *         in: query
 *         schema:
 *           type: string
 *         description: The filter on the substance dosage reference
 *       - name: substanceNature
 *         in: query
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - 'SA'
 *               - 'FT'
 *         description: The filter on the susbtance nature (SA: Active substance, FT: Theurapeutic moiety)
 *       - name: substancesLinkNumber
 *         in: query
 *         schema:
 *           type: string
 *         description: TODO
 *     responses:
 *       200:
 *         description: A list of drug compositions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DrugComposition'
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
router.get('/', DrugCompositionController.list)

/**
 * @swagger
 * /drug-compositions/{id}:
 *   get:
 *     tags: ['Drug Composition']
 *     summary: Retrieve a drug composition
 *     description: Retrieve a drug composition
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id of the drug composition
 *         required: true
 *     responses:
 *       200:
 *         description: A drug composition
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DrugComposition'
 *       401:
 *         $ref: '#/components/responses/MissingOrInvalidApiKeyError'
 *       404:
 *         description: Drug composition not found
 */
router.get('/:id', DrugCompositionController.get)

export default router

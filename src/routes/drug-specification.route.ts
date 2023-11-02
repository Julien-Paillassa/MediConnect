import { Router } from 'express'
import * as DrugSpecificationController from '../controllers/drug-specification.controller'

const router = Router()

/**
 * @swagger
 * tags:
 *   - name: Drug Specification
 *     description: Retrieve an API key and set it as a cookie through your browser console `document.cookie = 'X-API-KEY=your-api-key;path=/;'`
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DrugSpecification:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - form
 *         - administrations
 *         - marketingAuthorizationStatus
 *         - marketingAuthorizationProcedure
 *         - isBeingMarketed
 *         - marketingAuthorizationDate
 *         - ogDbStatus
 *         - europeanAuthorizationNumber
 *         - holders
 *         - reinforcedMonitoring
 *         - prescriptionRestriction
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the drug specification
 *         name:
 *           type: string
 *           description: The name of the drug
 *         form:
 *           type: string
 *           description: The pharmaceutical form of the drug
 *         administrations:
 *           type: array
 *           items:
 *             type: string
 *           description: The administrations of the drug
 *         marketingAuthorizationStatus:
 *           type: string
 *           description: The marketing authorization status of the drug
 *           enum:
 *             - 'Autorisation active'
 *             - 'Autorisation abrogée'
 *             - 'Autorisation archivée'
 *             - 'Autorisation retirée'
 *             - 'Autorisation suspendue'
 *         marketingAuthorizationProcedure:
 *           type: string
 *           description: The marketing authorization procedure of the drug
 *         isBeingMarketed:
 *           type: boolean
 *           description: Whether the drug is being marketed
 *         marketingAuthorizationDate:
 *           type: string
 *           description: The marketing authorization date of the drug
 *         ogDbStatus:
 *           type: string
 *           description: The status of the drug in the original database
 *           enum:
 *             - null
 *             - 'Alerte'
 *             - 'Warning disponibilité'
 *         europeanAuthorizationNumber:
 *           type: string
 *           description: The European authorization number of the drug
 *         holders:
 *           type: array
 *           items:
 *             type: string
 *           description: The holders of the drug
 *         reinforcedMonitoring:
 *           type: boolean
 *           description: Whether the drug is under reinforced monitoring
 *         prescriptionRestriction:
 *           type: string
 *           description: The prescription restriction of the drug
 *       example:
 *         id: 60234100
 *         name: DOLIPRANE 1000 mg, comprimé
 *         form: comprimé
 *         administrations:
 *           - orale
 *         marketingAuthorizationStatus: Autorisation active
 *         marketingAuthorizationProcedure: Procédure nationale
 *         isBeingMarketed: true
 *         marketingAuthorizationDate: 2002-07-09T00:00:00.000Z
 *         ogDbStatus: null
 *         europeanAuthorizationNumber: null
 *         holders:
 *           - OPELLA HEALTHCARE FRANCE
 *         reinforcedMonitoring: false
 *         prescriptionRestriction: null
 */

/**
 * @swagger
 * /drug-specifications:
 *   get:
 *     tags: ['Drug Specification']
 *     summary: Retrieve a list of drug specifications
 *     description: Retrieve a list of drug specifications.
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
 *       - name: form
 *         in: query
 *         schema:
 *           type: string
 *         description: The filter on the form
 *       - name: administrations
 *         in: query
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: The filter on the administrations
 *       - name: marketingAuthorizationStatus
 *         in: query
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - 'Autorisation active'
 *               - 'Autorisation abrogée'
 *               - 'Autorisation archivée'
 *               - 'Autorisation retirée'
 *               - 'Autorisation suspendue'
 *         description: The filter on the marketing authorization status
 *       - name: marketingAuthorizationProcedure
 *         in: query
 *         schema:
 *           type: string
 *         description: The filter on the marketing authorization procedure
 *       - name: isBeingMarketed
 *         in: query
 *         schema:
 *           type: boolean
 *         description: The filter on the is being marketed
 *       - name: marketingAuthorizationDateMin
 *         in: query
 *         schema:
 *           type: string
 *         description: The minimum date of the marketing authorization
 *         example: 2002-07-09T00:00:00.000Z
 *       - name: marketingAuthorizationDateMax
 *         in: query
 *         schema:
 *              type: string
 *         description: The maximum date of the marketing authorization
 *         example: 2022-07-09T23:59:59.999Z
 *       - name: ogDbStatus
 *         in: query
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - null
 *               - 'Alerte'
 *               - 'Warning disponibilité'
 *         description: The filter on the og db status
 *       - name: europeanAuthorizationNumber
 *         in: query
 *         schema:
 *           type: string
 *         description: The filter on the european authorization number
 *       - name: holders
 *         in: query
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           description: The filter on the holders
 *       - name: reinforcedMonitoring
 *         in: query
 *         schema:
 *           type: boolean
 *         description: The filter on the reinforced monitoring
 *     responses:
 *       200:
 *         description: A list of drug specifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DrugSpecification'
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
router.get('/', DrugSpecificationController.list)

/**
 * @swagger
 * /drug-specifications/{id}:
 *   get:
 *     tags: ['Drug Specification']
 *     summary: Retrieve a drug specification
 *     description: Retrieve a drug specification
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id of the drug specification
 *         required: true
 *     responses:
 *       200:
 *         description: A drug specification
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DrugSpecification'
 *       401:
 *         $ref: '#/components/responses/MissingOrInvalidApiKeyError'
 *       404:
 *         description: Drug specification not found
 */
router.get('/:id', DrugSpecificationController.get)

export default router

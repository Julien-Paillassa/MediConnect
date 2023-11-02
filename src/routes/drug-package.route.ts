import { Router } from 'express'
import * as DrugPackageController from '../controllers/drug-package.controller'

const router = Router()

/**
 * @swagger
 * tags:
 *   - name: Drug Package
 *     description: Retrieve an API key and set it as a cookie through your browser console `document.cookie = 'X-API-KEY=your-api-key;path=/;'`
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DrugPackage:
 *       type: object
 *       required: true
 *       properties:
 *         id:
 *           type: number
 *           description: The id of the drug package
 *         longId:
 *           type: bigint
 *           description: The long id of the drug package
 *         drugId:
 *           type: number
 *           description: The id of the related drug specification
 *         name:
 *           type: string
 *           description: The name of the drug package
 *         status:
 *           type: string
 *           description: The status of the drug package
 *           enum:
 *             - 'Présentation active'
 *             - 'Présentation abrogée'
 *         marketingAuthorizationStatus:
 *           type: string
 *           description: The marketing authorization declarated status of the drug package
 *           enum:
 *             - 'Déclaration de commercialisation'
 *             - 'Déclaration de suspension de commercialisation'
 *             - 'Arrêt de commercialisation déclaré'
 *             - 'Arrêt de commercialisation pour autorisation retirée'
 *         marketingAuthorizationDeclarationDate:
 *           type: string
 *           description: The marketing authorization date of the drug package
 *         isAgreedToCommunities:
 *           type: boolean
 *           description: Whether the drug package is agreed to communities
 *         refundRate:
 *           type: number
 *           description: The refund rate of the drug packaged with this drug package
 *         price:
 *           type: number
 *           description: The price of the drug packaged with this drug package
 *         refundInformation:
 *           type: array
 *           description: Any refund information
 *       example:
 *         id: 3595583
 *         longId: 3400935955838
 *         drugId: 60234100
 *         name: plaquette(s) thermoformée(s) PVC-aluminium de 8  comprimé(s)
 *         status: Présentation active
 *         marketingAuthorizationStatus: Déclaration de commercialisation
 *         marketingAuthorizationDeclarationDate: 2003-01-02T00:00:00.000Z
 *         isAgreedToCommunities: false
 *         refundRate: null
 *         price: null
 *         refundInformation: ''
 */

/**
 * @swagger
 * /drug-packages:
 *   get:
 *     tags: ['Drug Package']
 *     summary: Retrieve a list of drug packages
 *     description: Retrieve a list of drug packages.
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
 *       - name: drugId
 *         in: query
 *         schema:
 *           type: number
 *         description: The id of the related drug
 *       - name: name
 *         in: query
 *         schema:
 *           type: string
 *         description: The filter on the name
 *       - name: status
 *         in: query
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - 'Présentation active'
 *               - 'Présentation abrogée'
 *         description: The filter on the statuses
 *       - name: MarketingAuthorizationDeclarationStatus
 *         in: query
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - 'Déclaration de commercialisation'
 *               - 'Déclaration de suspension de commercialisation'
 *               - 'Arrêt de commercialisation déclaré'
 *               - 'Arrêt de commercialisation pour autorisation retirée'
 *         description: The filter on the marketing authorization status
 *       - name: marketingAuthorizationDeclarationDateMin
 *         in: query
 *         schema:
 *           type: string
 *         description: The mininimum date of the marketing authorization
 *         example: 2002-07-09T00:00:00.000Z
 *       - name: marketingAuthorizationDeclarationDateMax
 *         in: query
 *         schema:
 *              type: string
 *         description: The maximum date of the marketing authorization
 *         example: 2022-07-09T23:59:59.999Z
 *       - name: europeanAuthorizationNumber
 *         in: query
 *         schema:
 *           type: string
 *         description: The filter on the european authorization number
 *       - name: isAgreedToCommunities
 *         in: query
 *         schema:
 *           type: boolean
 *         description: Retrieve agreed to communities or not
 *       - name: refundRateMin
 *         in: query
 *         schema:
 *           type: number
 *         description: The refund minimum rate
 *       - name: refundRateMax
 *         in: query
 *         schema:
 *           type: number
 *         description: The refund maximum rate
 *       - name: priceMin
 *         in: query
 *         schema:
 *           type: number
 *         description: The minimum price
 *       - name: priceMax
 *         in: query
 *         schema:
 *           type: number
 *         description: The maximum price
 *     responses:
 *       200:
 *         description: A list of drug packages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DrugPackage'
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
router.get('/', DrugPackageController.list)

/**
 * @swagger
 * /drug-packages/{id}:
 *   get:
 *     tags: ['Drug Package']
 *     summary: Retrieve a drug package
 *     description: Retrieve a drug package
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id of the drug package
 *         required: true
 *     responses:
 *       200:
 *         description: A drug package
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DrugPackage'
 *       401:
 *         $ref: '#/components/responses/MissingOrInvalidApiKeyError'
 *       404:
 *         description: Drug package not found
 */
router.get('/:id', DrugPackageController.get)

export default router

import { Router } from 'express'

import { getAllInvoices, getInvoiceById, createInvoice } from '../controllers/invoice.controller'
import verifyToken from '../middlewares/auth.middleware'
import verifyCsrfToken from '../middlewares/csrf.middleware'

const router = Router()

router.route('/invoices').get(verifyToken, getAllInvoices)
router.route('/:id').get(verifyToken, getInvoiceById)
router.route('/create').post(verifyToken, verifyCsrfToken, createInvoice)

export default router

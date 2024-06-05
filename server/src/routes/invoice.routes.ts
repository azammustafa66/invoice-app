import { Router } from 'express'

import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice
} from '../controllers/invoice.controller'
import verifyToken from '../middlewares/auth.middleware'
import verifyCsrfToken from '../middlewares/csrf.middleware'

const router = Router()

router.route('/invoices').get(verifyToken, getAllInvoices)
router.route('/:id').get(verifyToken, getInvoiceById)
router.route('/create').post(verifyToken, verifyCsrfToken, createInvoice)
router.route('/update/:id').put(verifyToken, verifyCsrfToken, updateInvoice)
router.route('/delete/:id').delete(verifyToken, verifyCsrfToken, deleteInvoice)

export default router

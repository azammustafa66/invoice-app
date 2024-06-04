import { Router } from 'express'

import { register, login, logout, refreshAccessToken } from '../controllers/auth.controllers'
import verifyToken from '../middlewares/auth.middleware'
import verifyCsrfToken from '../middlewares/csrf.middleware'

const router = Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(verifyToken, verifyCsrfToken, logout)
router.route('/refresh-token').post(verifyToken, verifyCsrfToken, refreshAccessToken)

export default router

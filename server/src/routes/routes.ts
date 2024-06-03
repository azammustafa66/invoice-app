import { Router } from 'express'

import { register, login } from '../controllers/auth.controllers'

const router = Router()

router.route('/auth/register').post(register)
router.route('/auth/login').post(login)

export default router

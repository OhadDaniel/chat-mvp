import { Router } from 'express'
import { authenticate } from '../../middleware/auth'
import {
  getMessagesController,
  createMessageController,
} from './messages.controller'

const router = Router({ mergeParams: true })

router.get('/', authenticate, getMessagesController)
router.post('/', authenticate, createMessageController)

export default router

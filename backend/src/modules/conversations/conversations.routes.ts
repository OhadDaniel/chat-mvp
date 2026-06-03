import { Router } from 'express'
import { authenticate } from '../../middleware/auth'
import {
  getConversationsController,
  createConversationController,
  patchConversationController,
} from './conversations.controller'

const router = Router()

router.get('/', authenticate, getConversationsController)
router.post('/', authenticate, createConversationController)
router.patch('/:id', authenticate, patchConversationController)

export default router

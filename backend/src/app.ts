import express from 'express'
import cors from 'cors'
import { requestLogger } from './middleware/logger'
import { errorHandler } from './middleware/errorHandler'
import authRoutes from './modules/auth/auth.routes'
import conversationsRoutes from './modules/conversations/conversations.routes'
import messagesRoutes from './modules/messages/messages.routes'

const app = express()



app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use(requestLogger)



app.use('/auth', authRoutes)
app.use('/conversations', conversationsRoutes)
app.use('/conversations/:id/messages', messagesRoutes)



app.use(errorHandler)

export default app

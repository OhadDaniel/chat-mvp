import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

async function prepare(): Promise<void> {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }
}

prepare().then(() => {
  const root = document.getElementById('root')
  if (!root) throw new Error('Root element not found')
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})

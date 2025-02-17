import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './utils/axios' // Import axios interceptor before App
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

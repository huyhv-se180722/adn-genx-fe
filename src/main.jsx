import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx' // Import App thay vì Home

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { HeadProvider } from 'react-head';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <HeadProvider>
    <App />
      </HeadProvider>
    </AuthProvider>
  </StrictMode>,
)

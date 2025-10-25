import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './lib/contexts/AuthContext'
import './index.css'
import { router } from './routes'

const paypalOptions = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: "AUD",
  intent: "capture",
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <PayPalScriptProvider options={paypalOptions}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </PayPalScriptProvider>
    </HelmetProvider>
  </StrictMode>,
)

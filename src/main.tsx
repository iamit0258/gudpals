
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';

// For development purposes, we'll use a valid placeholder publishable key structure
// In production, you would use your actual Clerk publishable key from environment variables
const PUBLISHABLE_KEY = process.env.NODE_ENV === 'production' 
  ? import.meta.env.VITE_CLERK_PUBLISHABLE_KEY 
  : 'pk_test_ZmFrZS1jbGVyay1wdWJsaXNoYWJsZS1rZXktZm9yLWRldg'; // Fake but valid formatted key for dev

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
);

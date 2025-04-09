
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';

// Get your publishable key from the environment variable
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
  "pk_test_YWNlLXdlZXZpbC05OC5jbGVyay5hY2NvdW50cy5kZXYk";

if (!publishableKey) {
  console.warn("Missing Clerk Publishable Key. Authentication won't work properly.");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={publishableKey}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
);

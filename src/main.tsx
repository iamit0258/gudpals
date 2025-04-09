
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';

// Get your publishable key from the Clerk dashboard
// You should set this as an environment variable in production
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
  "pk_test_ZXhhbXBsZS1rb2FsYS01Mi5jbGVyay5hY2NvdW50cy5kZXYk"; // Example key for development

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

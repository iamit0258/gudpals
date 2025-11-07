
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

// Replace this with your actual Clerk publishable key from https://dashboard.clerk.com
const PUBLISHABLE_KEY = "pk_test_YWNlLXdlZXZpbC05OC5jbGVyay5hY2NvdW50cy5kZXYk";

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY.startsWith("pk_test_REPLACE")) {
  throw new Error("Missing Clerk Publishable Key - Please add your key from Clerk Dashboard");
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);

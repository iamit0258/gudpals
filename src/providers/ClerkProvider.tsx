
import React from "react";
import { ClerkProvider as ClerkProviderOriginal } from "@clerk/clerk-react";

// For development purposes, we'll use a valid placeholder publishable key structure
// In production, you would use your actual Clerk publishable key from environment variables
const PUBLISHABLE_KEY = process.env.NODE_ENV === 'production' 
  ? import.meta.env.VITE_CLERK_PUBLISHABLE_KEY 
  : 'pk_test_ZmFrZS1jbGVyay1wdWJsaXNoYWJsZS1rZXktZm9yLWRldg'; // Fake but valid formatted key for dev

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

export const ClerkProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <ClerkProviderOriginal
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        elements: {
          formButtonPrimary: "bg-dhayan-purple hover:bg-dhayan-purple-dark text-white",
          footerActionLink: "text-dhayan-purple hover:text-dhayan-purple-dark",
        },
      }}
    >
      {children}
    </ClerkProviderOriginal>
  );
};

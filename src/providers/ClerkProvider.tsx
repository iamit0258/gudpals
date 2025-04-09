
import React from "react";
import { ClerkProvider as ClerkProviderOriginal } from "@clerk/clerk-react";

// IMPORTANT: This should be a publishable key (starting with pk_)
// The key format you provided appears to be a secret key (sk_)
// For demo purposes we're using an example publishable key format
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_Y2xlcmsuZGVtby5sb3ZhYmxlLjEyMzQ1";

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

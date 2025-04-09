
import React from "react";
import { ClerkProvider as ClerkProviderOriginal } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = "pk_test_LA0ouf1r8YUkmHz59AH8nkbb32Qeh4gHwzghJN5qTW";

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

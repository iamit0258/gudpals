import React from "react";
import { ClerkProvider as ClerkProviderOriginal } from "@clerk/clerk-react";

// This file is deprecated and no longer in use
// ClerkProvider is now directly integrated in App.tsx
// Keeping this file for reference purposes only

export const ClerkProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  console.warn("This ClerkProvider component is deprecated. Please use the one in App.tsx");
  return <>{children}</>;
};

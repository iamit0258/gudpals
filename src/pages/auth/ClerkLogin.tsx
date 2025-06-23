
import React from "react";
import { SignIn } from "@clerk/clerk-react";

const ClerkLogin = () => {
  return (
    <div className="min-h-screen bg-dhayan-purple-light/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img 
            src="/lovable-uploads/f39713ff-dd36-4a15-af77-677c3b4a8e67.png" 
            alt="GUDPALS Logo" 
            className="h-24 mx-auto mb-2"
          />
          <h2 className="text-2xl font-bold">Welcome to GUDPALS</h2>
          <p className="text-dhayan-gray mt-2">Sign in to access your account</p>
        </div>
        
        <SignIn 
          fallbackRedirectUrl="/"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              card: "shadow-md",
              headerTitle: "text-center",
              socialButtonsBlockButton: "w-full",
              formButtonPrimary: "bg-dhayan-purple hover:bg-dhayan-purple-dark",
            }
          }}
        />
      </div>
    </div>
  );
};

export default ClerkLogin;

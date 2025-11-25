
import React from "react";
import { SignIn } from "@clerk/clerk-react";

const ClerkLogin = () => {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header section with logo and welcome text */}
        <div className="text-center mb-8">
          <img
            src="/lovable-uploads/f39713ff-dd36-4a15-af77-677c3b4a8e67.png"
            alt="GUDPALS Logo"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to GUDPALS</h1>
          <p className="text-gray-600 text-base">Sign in to access your account</p>
        </div>

        {/* Clerk SignIn component */}
        <div className="flex justify-center">
          <SignIn
            fallbackRedirectUrl="/"
            forceRedirectUrl="/"
            signUpUrl="/sign-up"
            appearance={{
              elements: {
                card: "shadow-lg border-0 w-full max-w-md",
                headerTitle: "text-center text-xl font-semibold",
                headerSubtitle: "text-center text-gray-600",
                socialButtonsBlockButton: "w-full mb-2",
                formButtonPrimary: "bg-dhayan-teal hover:bg-dhayan-teal/90 w-full",
                footerActionText: "text-center",
                footerActionLink: "text-dhayan-teal hover:text-dhayan-teal/80",
                formFieldInput: "w-full",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-500 text-sm",
              },
              layout: {
                logoImageUrl: undefined, // Remove duplicate logo from Clerk component
                showOptionalFields: false,
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ClerkLogin;


import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { signUp, isLoaded, setActive } = useSignUp();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDemoRegister = async () => {
    if (!isLoaded) {
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, you would collect user info and use actual credentials
      const email = `demo-${Date.now()}@example.com`;
      const password = "demo-password";
      
      // Create the user
      const result = await signUp.create({
        emailAddress: email,
        password: password,
      });
      
      // Check if the sign-up requires email verification
      if (result.status === "complete") {
        // If the sign-up is complete, activate the session
        await setActive({ session: result.createdSessionId });
        
        toast({
          title: "Account created",
          description: "Your account has been created successfully",
        });
        
        // Navigate to appropriate page
        navigate('/');
      } else if (result.status === "needs_email_verification") {
        // If email verification is needed, let the user know
        toast({
          title: "Verification required",
          description: "Please check your email for verification instructions",
        });
        
        // You could navigate to a verification page here
      } else {
        toast({
          title: "Registration incomplete",
          description: "Please complete the registration process",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-dhayan-purple-light/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Create an Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-500">
              {isLoaded ? "Sign up to create your account" : "Loading registration..."}
            </p>
            <Button 
              className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white"
              onClick={handleDemoRegister}
              disabled={!isLoaded || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Continue as Demo User"
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-sm text-center text-dhayan-gray">
              By registering, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;

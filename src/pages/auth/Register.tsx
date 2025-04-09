
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { signUp, isLoaded } = useSignUp();
  const { toast } = useToast();
  
  const handleDemoRegister = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      // In a real app, you would collect user info and use actual credentials
      const email = `demo-${Date.now()}@example.com`;
      const password = "demo-password";
      
      // Create the user
      const result = await signUp.create({
        emailAddress: email,
        password: password,
      });
      
      // Verify the email if needed
      await signUp.prepareEmailAddressVerification();
      
      toast({
        title: "Account created",
        description: "Please verify your email to continue",
      });
      
      // Navigate to appropriate page
      navigate('/');
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "Please try again later",
        variant: "destructive",
      });
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
              disabled={!isLoaded}
            >
              Continue as Demo User
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

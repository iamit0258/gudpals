
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import LoginHeader from "@/components/auth/LoginHeader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LoginFooter from "@/components/auth/LoginFooter";
import { useSignIn } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, isLoaded } = useSignIn();
  const { toast } = useToast();
  
  const handleDemoLogin = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      // Example of demo login with Clerk
      const result = await signIn.create({
        strategy: "password",
        identifier: "demo@example.com",
        password: "demo-password",
      });
      
      if (result.status === "complete") {
        navigate('/');
        toast({
          title: "Login successful",
          description: "You have successfully logged in",
        });
      } else {
        // Handle incomplete login
        toast({
          title: "Login incomplete",
          description: "Please complete the login process",
          variant: "destructive",
        });
        console.error("Login incomplete", result);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Authentication temporarily using demo login",
        variant: "destructive",
      });
      
      // Fallback to demo login in case of error
      navigate('/');
    }
  };
  
  return (
    <div className="min-h-screen bg-dhayan-purple-light/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginHeader />
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-500">
              {isLoaded ? "Sign in with your credentials" : "Loading authentication..."}
            </p>
            <Button 
              className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white"
              onClick={handleDemoLogin}
              disabled={!isLoaded}
            >
              Continue as Demo User
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col">
            <LoginFooter />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;

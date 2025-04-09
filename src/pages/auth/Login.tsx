
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import LoginHeader from "@/components/auth/LoginHeader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LoginFooter from "@/components/auth/LoginFooter";
import { useSignIn } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, isLoaded, setActive } = useSignIn();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDemoLogin = async () => {
    if (!isLoaded) {
      return;
    }

    setIsLoading(true);

    try {
      // Example of demo login with Clerk
      const result = await signIn.create({
        identifier: "demo@example.com",
        password: "demo-password",
      });
      
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        
        navigate('/');
        toast({
          title: "Login successful",
          description: "You have successfully logged in",
        });
      } else {
        // Handle incomplete login
        console.error("Login incomplete", result);
        
        if (result.status === "needs_second_factor") {
          toast({
            title: "Second factor required",
            description: "Please complete the two-factor authentication",
          });
          // You could navigate to a 2FA page here if needed
        } else {
          toast({
            title: "Login incomplete",
            description: "Please complete the login process",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Authentication failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
              disabled={!isLoaded || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Continue as Demo User"
              )}
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

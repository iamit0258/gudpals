
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import LoginHeader from "@/components/auth/LoginHeader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LoginFooter from "@/components/auth/LoginFooter";

const Login = () => {
  const navigate = useNavigate();
  
  const handleDemoLogin = () => {
    navigate('/');
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
              Authentication is temporarily disabled
            </p>
            <Button 
              className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white"
              onClick={handleDemoLogin}
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

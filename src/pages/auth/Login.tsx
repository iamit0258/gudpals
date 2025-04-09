
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import LoginHeader from "@/components/auth/LoginHeader";
import { SignIn } from "@clerk/clerk-react";
import LoginFooter from "@/components/auth/LoginFooter";

const Login = () => {
  return (
    <div className="min-h-screen bg-dhayan-purple-light/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginHeader />
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <SignIn
              routing="path"
              path="/login"
              signUpUrl="/register"
              redirectUrl="/"
            />
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

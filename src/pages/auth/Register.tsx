
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  
  const handleDemoRegister = () => {
    navigate('/');
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
              Registration is temporarily disabled
            </p>
            <Button 
              className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white"
              onClick={handleDemoRegister}
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

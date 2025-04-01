
import React from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const LoginAlternatives = () => {
  return (
    <>
      <div className="relative flex justify-center text-xs uppercase my-4">
        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
      </div>
      
      <Button variant="outline" className="w-full">
        <User className="mr-2 h-4 w-4" />
        Continue as Guest
      </Button>
    </>
  );
};

export default LoginAlternatives;

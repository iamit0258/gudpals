
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const LoginFooter = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex justify-center p-4 pt-0">
        <p className="text-xs text-dhayan-gray">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-dhayan-gray">
          New to GUDPALS?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto text-dhayan-purple"
            onClick={() => navigate("/signup")}
          >
            Create an account <ArrowRight className="ml-1 h-3 w-3 inline" />
          </Button>
        </p>
      </div>
    </>
  );
};

export default LoginFooter;

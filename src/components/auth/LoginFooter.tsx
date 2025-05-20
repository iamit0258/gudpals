
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface LoginFooterProps {
  text?: string;
  linkText?: string;
  linkUrl?: string;
}

const LoginFooter: React.FC<LoginFooterProps> = ({ 
  text = "New to GUDPALS?", 
  linkText = "Create an account", 
  linkUrl = "/signup" 
}) => {
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
          {text}{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto text-dhayan-purple"
            onClick={() => navigate(linkUrl)}
          >
            {linkText} <ArrowRight className="ml-1 h-3 w-3 inline" />
          </Button>
        </p>
      </div>
    </>
  );
};

export default LoginFooter;

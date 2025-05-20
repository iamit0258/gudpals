
import React from "react";

interface LoginHeaderProps {
  title?: string;
  subtitle?: string;
}

const LoginHeader: React.FC<LoginHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-6">
      <img 
        src="/lovable-uploads/f39713ff-dd36-4a15-af77-677c3b4a8e67.png" 
        alt="GUDPALS Logo" 
        className="h-24 mx-auto mb-2"
      />
      <h2 className="text-2xl font-bold">{title || "Welcome to GUDPALS"}</h2>
      <p className="text-dhayan-gray mt-2">{subtitle || "Login to access your GUDPALS account"}</p>
    </div>
  );
};

export default LoginHeader;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginLayout from "@/components/layout/LoginLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoginAlternatives from "@/components/auth/LoginAlternatives";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginFooter from "@/components/auth/LoginFooter";
import { useLanguage } from "@/context/language/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";

const Register = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      toast({
        title: t("error"),
        description: t("please_fill_all_fields"),
        variant: "destructive",
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t("error"),
        description: t("passwords_do_not_match"),
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error, status } = await register({
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        options: {
          data: {
            display_name: formData.fullName,
          },
        },
      });
      
      if (error) {
        toast({
          title: t("registration_failed"),
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Fix the type comparison issue - use loose comparison
      if (status == "needs_email_verification") {
        navigate("/verify");
      } else {
        navigate("/");
      }
      
      toast({
        title: t("registration_successful"),
        description: t("account_created"),
      });
    } catch (error) {
      toast({
        title: t("error"),
        description: error.message || t("something_went_wrong"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginLayout>
      <LoginHeader
        title={t("create_account")}
        subtitle={t("register_subtitle")}
      />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            name="fullName"
            placeholder={t("full_name")}
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder={t("email")}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="tel"
            name="phone"
            placeholder={t("phone_number")}
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder={t("password")}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder={t("confirm_password")}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-dhayan-teal hover:bg-dhayan-teal-dark"
          disabled={loading}
        >
          {loading ? t("registering") : t("register")}
        </Button>
      </form>
      
      <div className="my-6">
        <LoginAlternatives />
      </div>
      
      <LoginFooter
        text={t("already_have_account")}
        linkText={t("login_here")}
        linkUrl="/login"
      />
    </LoginLayout>
  );
};

export default Register;

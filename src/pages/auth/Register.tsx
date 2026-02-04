
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginLayout from "@/components/layout/LoginLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoginHeader from "@/components/auth/LoginHeader";
import { useLanguage } from "@/context/language/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { sendOTP } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
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
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({
        title: t("error"),
        description: t("please_fill_all_fields"),
        variant: "destructive",
      });
      return;
    }

    if (formData.fullName.length < 3) {
      toast({
        title: t("error"),
        description: "Name must be at least 3 characters",
        variant: "destructive",
      });
      return;
    }

    if (formData.phone.length !== 10) {
      toast({
        title: t("error"),
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Store form data for post-verification logic (similar to Signup.tsx)
      sessionStorage.setItem("dhayan_signup_data", JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone // Ensure phone is stored if needed by Verify
      }));

      // Check if registering for Activities, Sessions or Digital Literacy (skip OTP)
      const fromPath = (location.state as any)?.from;
      const activityType = (location.state as any)?.activityType;

      if (fromPath === '/activities' || fromPath === '/digital-literacy' || fromPath === '/sessions' || activityType === 'session') {
        toast({
          title: "Registration Successful",
          description: "You have successfully registered for the activity.",
        });
        navigate(fromPath || "/", {
          state: {
            registered: true,
            activityName: (location.state as any)?.activityName
          }
        });
        return;
      }

      await sendOTP("+91" + formData.phone);

      // Pass state to Verify page
      navigate("/verify", {
        state: {
          phoneNumber: "+91" + formData.phone,
          isSignup: true,
          from: (location.state as any)?.from
        }
      });

      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your phone",
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
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="hover:bg-transparent"
        >
          <ArrowLeft className="h-6 w-6 text-dhayan-teal" />
        </Button>
      </div>

      <LoginHeader
        title="New Registration"
        subtitle="Enter your details to join"
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
            placeholder={t("Email")}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="tel"
            name="phone"
            placeholder={t("phone_number")}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
            maxLength={10}
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
    </LoginLayout>
  );
};

export default Register;

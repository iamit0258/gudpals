
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone } from "lucide-react";

const LoginForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const { sendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    setIsValidPhone(phoneNumber.length === 10 && /^\d{10}$/.test(phoneNumber));
  }, [phoneNumber]);

  useEffect(() => {
    const rememberedPhone = localStorage.getItem("gudpals_remember_phone");
    if (rememberedPhone) {
      setPhoneNumber(rememberedPhone);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPhone) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await sendOTP("+91" + phoneNumber);

      if (rememberMe) {
        localStorage.setItem("gudpals_remember_phone", phoneNumber);
      } else {
        localStorage.removeItem("gudpals_remember_phone");
      }

      navigate("/verify", {
        state: {
          phoneNumber: "+91" + phoneNumber,
          from: (location.state as any)?.from
        }
      });
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your phone",
      });
    } catch (error) {
      toast({
        title: "Error sending OTP",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex">
          <div className="bg-gray-100 border border-r-0 border-input rounded-l-md px-3 flex items-center text-sm text-muted-foreground">
            +91
          </div>
          <Input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter your phone number"
            className="rounded-l-none focus-visible:ring-primary"
            maxLength={10}
            required
            autoComplete="tel"
            aria-invalid={phoneNumber.length > 0 && !isValidPhone}
            aria-describedby="phone-error"
          />
        </div>
        {phoneNumber.length > 0 && !isValidPhone && (
          <p id="phone-error" className="text-xs text-destructive mt-1">
            Please enter a valid 10-digit phone number
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked === true)}
        />
        <Label
          htmlFor="remember"
          className="text-sm cursor-pointer"
        >
          Remember me for 30 days
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
        disabled={isLoading || !isValidPhone}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send OTP
            <Phone className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
};
export default LoginForm;
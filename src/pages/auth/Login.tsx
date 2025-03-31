
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/auth"; // Updated import path
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone, User, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const { sendOTP } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if phone number is 10 digits
    setIsValidPhone(phoneNumber.length === 10 && /^\d{10}$/.test(phoneNumber));
  }, [phoneNumber]);

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
      
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("dhayan_remember_phone", phoneNumber);
      } else {
        localStorage.removeItem("dhayan_remember_phone");
      }
      
      navigate("/verify", { state: { phoneNumber: "+91" + phoneNumber } });
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

  // Load remembered phone number if available
  useEffect(() => {
    const rememberedPhone = localStorage.getItem("dhayan_remember_phone");
    if (rememberedPhone) {
      setPhoneNumber(rememberedPhone);
      setRememberMe(true);
    }
  }, []);

  // Calculate password strength (for future email/password implementation)
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  return (
    <div className="min-h-screen bg-dhayan-purple-light/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-dhayan-purple-dark">
            <span className="text-dhayan-purple">ग्</span> GUDPALS
          </h1>
          <p className="text-dhayan-gray mt-2">Login to access your GUDPALS account</p>
        </div>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex">
                  <div className="bg-gray-100 border border-r-0 border-input rounded-l-md px-3 flex items-center text-sm text-dhayan-gray-dark">
                    +91
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter your phone number"
                    className="rounded-l-none focus-visible:ring-dhayan-purple"
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
                className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white transition-all"
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
          </CardContent>
          <CardFooter className="flex justify-center p-4 pt-0">
            <p className="text-xs text-dhayan-gray">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardFooter>
        </Card>

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
      </div>
    </div>
  );
};

export default Login;

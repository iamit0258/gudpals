
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";

const Signup = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const { sendOTP } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isValidPhone = phoneNumber.length === 10 && /^\d{10}$/.test(phoneNumber);
  const isValidEmail = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidName = name.trim().length >= 3;
  const canSubmit = isValidPhone && isValidName && isValidEmail && agree;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit) return;
    
    setIsLoading(true);
    
    try {
      // Store form data for post-verification
      sessionStorage.setItem("dhayan_signup_data", JSON.stringify({
        name: name.trim(),
        email: email.trim() || null,
      }));
      
      await sendOTP("+91" + phoneNumber);
      
      navigate("/verify", { 
        state: { 
          phoneNumber: "+91" + phoneNumber,
          isSignup: true 
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
    <div className="min-h-screen bg-dhayan-purple-light/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/login")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Button>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-center">Create an Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="focus-visible:ring-dhayan-purple"
                  required
                  autoComplete="name"
                />
                {name && !isValidName && (
                  <p className="text-xs text-destructive mt-1">
                    Name must be at least 3 characters
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
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
                  />
                </div>
                {phoneNumber && !isValidPhone && (
                  <p className="text-xs text-destructive mt-1">
                    Please enter a valid 10-digit phone number
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="focus-visible:ring-dhayan-purple"
                  autoComplete="email"
                />
                {email && !isValidEmail && (
                  <p className="text-xs text-destructive mt-1">
                    Please enter a valid email address
                  </p>
                )}
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agree} 
                  onCheckedChange={(checked) => setAgree(checked === true)}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the Terms of Service and Privacy Policy
                </Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white transition-all"
                disabled={isLoading || !canSubmit}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Continue
                    <Phone className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center p-4 pt-0">
            <p className="text-xs text-dhayan-gray">
              Your information is protected under our Privacy Policy
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;

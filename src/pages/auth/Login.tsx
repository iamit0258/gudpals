
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { User, Phone } from "lucide-react";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { sendOTP } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length !== 10) {
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

  return (
    <div className="min-h-screen bg-dhayan-purple-light/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-dhayan-purple-dark">
            <span className="text-dhayan-purple">ध्यान</span> Dhayan
          </h1>
          <p className="text-dhayan-gray mt-2">Login to access your Dhayan account</p>
        </div>
        
        <Card>
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
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                    className="rounded-l-none"
                    maxLength={10}
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">Remember me for 30 days</Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send OTP"}
                <Phone className="ml-2 h-4 w-4" />
              </Button>
            </form>
            
            <div className="relative flex justify-center text-xs uppercase my-4">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
            
            <Button variant="outline" className="w-full">
              <User className="mr-2 h-4 w-4" />
              Continue as Guest
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

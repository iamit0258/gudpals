
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth"; // Updated import path
import { ArrowLeft } from "lucide-react";

const Register = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { sendOTP } = useAuth();
  
  // Get the redirect path from state or default to homepage
  const redirectPath = location.state?.from || "/";
  const activityType = location.state?.activityType || "activity";
  const activityName = location.state?.activityName || "this activity";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || !name) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Validate phone number (simple validation)
    if (!/^\d{10}$/.test(phoneNumber)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Store registration data in session storage to use after verification
      const registrationData = {
        displayName: name,
        age: age,
        activityType,
        activityName,
        redirectPath,
        registeredAt: new Date().toISOString(),
      };
      
      sessionStorage.setItem("dhayan_signup_data", JSON.stringify(registrationData));
      
      // Send OTP
      await sendOTP(phoneNumber);
      
      // Redirect to verification page
      navigate("/verify", { state: { phoneNumber, isRegistration: true } });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Unable to proceed with registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-dhayan-purple-light/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Register for {activityName}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your 10-digit phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Age (Optional)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Registering...</span>
                ) : (
                  "Register & Continue"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-sm text-center text-dhayan-gray">
              By registering, you'll receive an OTP to verify your phone number.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;

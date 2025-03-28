
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { verifyOTP, sendOTP } = useAuth();
  
  // Get the phone number and registration flag from location state
  const phoneNumber = location.state?.phoneNumber || "";
  const isRegistration = location.state?.isRegistration || false;
  
  // Start countdown for resend OTP
  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = window.setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);
  
  // If no phone number in state, redirect to login
  useEffect(() => {
    if (!phoneNumber) {
      navigate("/login", { replace: true });
    }
  }, [phoneNumber, navigate]);
  
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP sent to your phone",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await verifyOTP(phoneNumber, otp);
      
      toast({
        title: "Verification successful",
      });
      
      // Check if we have signup data with activity info
      const signupData = sessionStorage.getItem("dhayan_signup_data");
      
      if (signupData) {
        try {
          const data = JSON.parse(signupData);
          if (data.redirectPath && data.activityName) {
            // Redirect to the original activity page with registration success state
            navigate(data.redirectPath, { 
              state: { 
                registered: true,
                activityName: data.activityName 
              } 
            });
            return;
          }
        } catch (error) {
          console.error("Error parsing signup data:", error);
        }
      }
      
      // Default redirect to home page
      navigate("/");
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "The OTP you entered is incorrect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    try {
      await sendOTP(phoneNumber);
      setCountdown(30);
      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your phone",
      });
    } catch (error) {
      toast({
        title: "Failed to resend OTP",
        description: "Please try again later",
        variant: "destructive",
      });
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
            <CardTitle className="text-center">Verify Your Phone</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <p className="text-center text-sm text-dhayan-gray mb-6">
                Enter the 6-digit code sent to
                <br />
                <span className="font-semibold text-dhayan-purple-dark">{phoneNumber}</span>
              </p>
              
              <div className="flex justify-center my-6">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Verifying...</span>
                ) : (
                  "Verify & Continue"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-sm text-center text-dhayan-gray">
              Didn't receive the code?{" "}
              <button
                type="button"
                className={`font-semibold ${
                  countdown > 0
                    ? "text-dhayan-gray cursor-not-allowed"
                    : "text-dhayan-purple cursor-pointer"
                }`}
                onClick={handleResendOTP}
                disabled={countdown > 0}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
              </button>
            </p>
            
            {isRegistration && (
              <p className="text-xs text-center text-dhayan-gray mt-4">
                By verifying your phone, you're creating a new account and agreeing to our Terms of Service and Privacy Policy.
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Verify;

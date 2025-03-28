
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { verifyOTP, sendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const phoneNumber = location.state?.phoneNumber || "";
  
  useEffect(() => {
    if (!phoneNumber) {
      navigate("/login");
      return;
    }
    
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [timer, phoneNumber, navigate]);
  
  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      await sendOTP(phoneNumber);
      setTimer(30);
      toast({
        title: "OTP Sent",
        description: "A new verification code has been sent to your phone",
      });
    } catch (error) {
      toast({
        title: "Error sending OTP",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };
  
  const handleVerify = async () => {
    if (otp.length !== 6) return;
    
    setIsVerifying(true);
    try {
      await verifyOTP(phoneNumber, otp);
      toast({
        title: "Verification Successful",
        description: "You have been logged in successfully",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Incorrect OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
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
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Verify Your Phone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-dhayan-gray">
              We've sent a 6-digit verification code to <br />
              <span className="font-semibold text-dhayan-gray-dark">{phoneNumber}</span>
            </p>
            
            <div className="flex justify-center my-4">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, index) => (
                      <InputOTPSlot key={index} {...slot} />
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>
            
            <Button 
              className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white"
              onClick={handleVerify}
              disabled={otp.length !== 6 || isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify & Continue"}
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-dhayan-gray">Didn't receive code?</p>
              {timer > 0 ? (
                <p className="text-sm text-dhayan-gray-dark">
                  Resend in <span className="font-semibold">{timer}s</span>
                </p>
              ) : (
                <Button
                  variant="link"
                  className="text-dhayan-purple p-0 h-auto"
                  onClick={handleResendOTP}
                  disabled={isResending}
                >
                  {isResending ? "Sending..." : "Resend Code"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Verify;

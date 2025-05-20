
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle, CreditCard, Calendar, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AstrologyPayment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [astrologer, setAstrologer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Payment form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Load astrologer data from localStorage
  useEffect(() => {
    const storedAstrologer = localStorage.getItem("selectedAstrologer");
    if (storedAstrologer) {
      setAstrologer(JSON.parse(storedAstrologer));
    } else {
      // No astrologer selected, redirect back
      toast({
        title: "Error",
        description: "No astrologer selected. Please select an astrologer first.",
        variant: "destructive"
      });
      navigate("/astrology");
    }
  }, [navigate, toast]);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length > 0 ? parts.join(" ") : value;
  };

  // Format expiry date as MM/YY
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !cardName || !expiry || !cvv) {
      toast({
        title: "Missing fields",
        description: "Please fill in all payment details",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      setPaymentSuccess(true);
      
      toast({
        title: "Payment Successful",
        description: `Your consultation with ${astrologer?.name} has been booked.`
      });
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <MobileLayout>
        <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your consultation with {astrologer?.name} has been confirmed.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            You'll receive a confirmation email shortly with details to join the consultation.
          </p>
          <Button
            className="w-full bg-green-600 hover:bg-green-700 mb-3"
            onClick={() => navigate("/astrology")}
          >
            Return to Astrology
          </Button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-teal-700 text-white p-4">
        <Button variant="ghost" className="p-0 text-white mb-2" onClick={() => navigate("/astrology")}>
          <ArrowLeft className="h-5 w-5 mr-1" /> Back
        </Button>
        <h1 className="text-xl font-bold">Book Consultation</h1>
      </div>
      
      {/* Astrologer and Payment Summary */}
      <div className="p-4">
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              {astrologer && (
                <>
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold mr-3">
                    {astrologer.initials}
                  </div>
                  <div>
                    <h2 className="font-medium">{astrologer?.name}</h2>
                    <p className="text-sm text-gray-600">{astrologer?.specialty}</p>
                  </div>
                </>
              )}
            </div>
            
            <div className="border-t border-b py-3 my-3">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Consultation Fee</span>
                <span>₹{astrologer?.price}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Platform Fee</span>
                <span>₹49</span>
              </div>
            </div>
            
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span className="text-green-700">₹{astrologer?.price ? (astrologer.price + 49) : 0}</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Payment Form */}
        <h2 className="text-lg font-semibold mb-3">Payment Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium block">Card Number</label>
              <div className="relative">
                <Input 
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  placeholder="1234 5678 9012 3456"
                  className="pl-10"
                />
                <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium block">Cardholder Name</label>
              <Input 
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium block">Expiry Date</label>
                <div className="relative">
                  <Input 
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    placeholder="MM/YY"
                    className="pl-10"
                  />
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium block">CVV</label>
                <div className="relative">
                  <Input 
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    maxLength={3}
                    placeholder="123"
                    className="pl-10"
                  />
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : `Pay ₹${astrologer?.price ? (astrologer.price + 49) : 0}`}
            </Button>
            
            <p className="text-center text-xs text-gray-500 mt-2">
              Your payment information is secure and encrypted
            </p>
          </div>
        </form>
      </div>
    </MobileLayout>
  );
};

export default AstrologyPayment;


import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import PaymentGateway from "@/components/payment/PaymentGateway";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  // Get payment amount from navigation state or default to demo amount
  const amount = location.state?.amount || 999;
  const orderDetails = location.state?.orderDetails;

  const handlePaymentSuccess = (data: any) => {
    setPaymentData(data);
    setPaymentComplete(true);
    
    // Store payment record
    const paymentHistory = JSON.parse(localStorage.getItem('paymentHistory') || '[]');
    paymentHistory.push({
      ...data,
      orderDetails: orderDetails
    });
    localStorage.setItem('paymentHistory', JSON.stringify(paymentHistory));
  };

  const handlePaymentCancel = () => {
    toast({
      title: "Payment Cancelled",
      description: "Your payment has been cancelled. You can try again anytime.",
    });
    navigate(-1);
  };

  if (paymentComplete) {
    return (
      <MobileLayout>
        <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-4">
            Your payment has been processed successfully.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6 w-full max-w-sm">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span className="font-mono">{paymentData?.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-semibold">₹{amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="capitalize">{paymentData?.method?.replace('-', ' ')}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 w-full max-w-xs">
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Go to Home
            </Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="p-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Payment</h1>
        </div>
        
        <PaymentGateway
          amount={amount}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentCancel={handlePaymentCancel}
        />
      </div>
    </MobileLayout>
  );
};

export default PaymentPage;

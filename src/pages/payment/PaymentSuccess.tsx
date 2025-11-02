import React from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">
          Your payment has been processed successfully. Thank you for your purchase!
        </p>
        <div className="space-y-2 w-full max-w-xs">
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => navigate("/")}
          >
            Go to Home
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default PaymentSuccess;

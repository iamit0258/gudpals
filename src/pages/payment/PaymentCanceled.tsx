import React from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const PaymentCanceled = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Canceled</h1>
        <p className="text-muted-foreground mb-6">
          Your payment was canceled. You can try again anytime.
        </p>
        <div className="space-y-2 w-full max-w-xs">
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => navigate(-1)}
          >
            Try Again
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
};

export default PaymentCanceled;

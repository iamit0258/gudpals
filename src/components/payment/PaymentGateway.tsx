
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentGatewayProps {
  amount: number;
  productId?: number;
  consultationId?: string;
  cartItems?: any[];
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentCancel: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  amount,
  productId,
  consultationId,
  cartItems,
  onPaymentSuccess,
  onPaymentCancel
}) => {
  const { toast } = useToast();

  useEffect(() => {
    const initiateStripePayment = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Authentication Required",
            description: "Please log in to continue",
            variant: "destructive",
          });
          return;
        }

        const payload: any = {};
        
        if (productId) {
          payload.productId = productId;
          payload.quantity = 1;
        } else if (consultationId) {
          payload.consultationId = consultationId;
        } else if (cartItems) {
          payload.cartItems = cartItems;
        }

        const { data, error } = await supabase.functions.invoke("create-payment", {
          body: payload,
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (error) throw error;
        
        if (data?.url) {
          // Redirect to Stripe Checkout in new tab
          window.open(data.url, '_blank');
          
          toast({
            title: "Redirecting to Payment",
            description: "Complete your payment in the new tab",
          });
        }
      } catch (error: any) {
        console.error("Payment error:", error);
        toast({
          title: "Payment Setup Failed",
          description: error.message || "Unable to initialize payment",
          variant: "destructive",
        });
      }
    };

    initiateStripePayment();
  }, [amount, productId, consultationId, cartItems, toast]);

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg font-semibold mb-2">Redirecting to Payment Gateway</p>
        <p className="text-sm text-muted-foreground">
          Please complete your payment in the new window
        </p>
        <Button 
          variant="outline" 
          onClick={onPaymentCancel}
          className="mt-4"
        >
          Cancel Payment
        </Button>
      </div>
    </div>
  );
};

export default PaymentGateway;

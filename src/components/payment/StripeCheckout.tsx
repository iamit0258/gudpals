import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface CheckoutFormProps {
  amount: number;
  onSuccess: (data: any) => void;
  onCancel: () => void;
}

const CheckoutForm = ({ amount, onSuccess, onCancel }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/payment-success",
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        onSuccess({
          transactionId: `stripe_${Date.now()}`,
          method: "stripe",
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      toast({
        title: "Payment Error",
        description: err.message || "An error occurred during payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">Amount to pay</span>
          <span className="text-2xl font-bold">₹{amount}</span>
        </div>
      </div>

      <PaymentElement />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-primary hover:bg-primary/90"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? "Processing..." : `Pay ₹${amount}`}
        </Button>
      </div>
    </form>
  );
};

interface StripeCheckoutProps {
  amount: number;
  productId?: number;
  consultationId?: string;
  onSuccess: (data: any) => void;
  onCancel: () => void;
}

const StripeCheckout = ({ amount, productId, consultationId, onSuccess, onCancel }: StripeCheckoutProps) => {
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const createPaymentIntent = async () => {
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

        const { data, error } = await supabase.functions.invoke("create-payment", {
          body: { productId, consultationId, quantity: 1 },
        });

        if (error) throw error;
        
        if (data?.url) {
          // Open Stripe in new tab instead of redirecting
          window.open(data.url, '_blank', 'noopener,noreferrer');
          
          toast({
            title: "Payment Page Opened",
            description: "Stripe checkout opened in a new tab. Complete your payment there.",
            variant: "default",
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

    createPaymentIntent();
  }, [amount, productId, consultationId, toast]);

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Setting up payment...</p>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
};

export default StripeCheckout;

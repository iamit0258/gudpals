import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, CreditCard, ShieldCheck, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/ClerkAuthBridge";

const AstrologyPayment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [astrologer, setAstrologer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a consultation",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create consultation record
      // Note: We are using a dummy UUID for the astrologer if the ID is not a valid UUID (e.g. "1", "2" from mock data)
      // In a real app, we would fetch the real astrologer ID from the DB.
      // For this demo, we'll try to find a real astrologer or use a fallback if the ID is not a UUID.

      let astrologerId = astrologer.id;
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(astrologerId);

      if (!isUuid) {
        // Fetch a valid astrologer from DB to use as fallback
        const { data: astrologers, error: astrologerError } = await supabase
          .from('astrologers')
          .select('id')
          .limit(1);

        if (astrologerError) {
          console.error("Error fetching astrologer:", astrologerError);
          throw new Error("Failed to fetch astrologer data. Please try again.");
        }

        if (astrologers && astrologers.length > 0) {
          astrologerId = astrologers[0].id;
        } else {
          throw new Error("No valid astrologer found in system. Please contact support.");
        }
      }

      const { data: consultation, error: consultationError } = await supabase
        .from('astrology_consultations')
        .insert({
          user_id: user.uid,
          astrologer_id: astrologerId,
          consultation_type: 'chat',
          total_cost: (astrologer.price || 0) + 49,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (consultationError) throw consultationError;

      // 2. Invoke create-payment
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          consultationId: consultation.id,
          userEmail: user.email,
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No payment URL returned");
      }

    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check for success query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("session_id")) {
      setPaymentSuccess(true);
    }
  }, []);

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
          <div className="space-y-3 w-full">
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => navigate("/astrology/chat")}
            >
              Start Consultation Now
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/astrology")}
            >
              Return to Astrology
            </Button>
          </div>
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

        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-start">
              <ShieldCheck className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">Secure Payment</h3>
                <p className="text-sm text-blue-600 mt-1">
                  Your payment is processed securely by Stripe. We do not store your card details.
                </p>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary/90 h-12 text-lg"
            onClick={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Pay with Stripe
              </div>
            )}
          </Button>

          <div className="flex justify-center items-center text-xs text-gray-500 mt-4">
            <Lock className="h-3 w-3 mr-1" />
            <span>256-bit SSL Encrypted Payment</span>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default AstrologyPayment;

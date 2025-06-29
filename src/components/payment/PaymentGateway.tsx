
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Smartphone, Building, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentGatewayProps {
  amount: number;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentCancel: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  amount,
  onPaymentSuccess,
  onPaymentCancel
}) => {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Credit/Debit Card State
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });

  // UPI State
  const [upiId, setUpiId] = useState("");

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState("");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleCardInputChange = (field: string, value: string) => {
    if (field === "number") {
      // Format card number with spaces
      value = value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
      if (value.length > 19) return;
    }
    if (field === "expiry") {
      // Format expiry as MM/YY
      value = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
      if (value.length > 5) return;
    }
    if (field === "cvv") {
      value = value.replace(/\D/g, "");
      if (value.length > 3) return;
    }
    
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentData = {
        method: paymentMethod,
        amount: amount,
        transactionId: `TXN${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: "success"
      };

      toast({
        title: "Payment Successful!",
        description: `Payment of ${formatPrice(amount)} completed successfully`,
      });

      onPaymentSuccess(paymentData);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = () => {
    switch (paymentMethod) {
      case "credit-card":
      case "debit-card":
        return cardData.number.replace(/\s/g, "").length >= 16 && 
               cardData.expiry.length === 5 && 
               cardData.cvv.length >= 3 && 
               cardData.name.trim().length > 0;
      case "upi":
        return upiId.includes("@") && upiId.length > 5;
      case "netbanking":
        return selectedBank !== "";
      default:
        return false;
    }
  };

  const banks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Bank of Baroda",
    "Punjab National Bank",
    "Canara Bank",
    "Union Bank of India",
    "Bank of India",
    "Central Bank of India"
  ];

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total Amount:</span>
            <span className="text-primary">{formatPrice(amount)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="credit-card" id="credit-card" />
                <Label htmlFor="credit-card" className="flex items-center cursor-pointer flex-1">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  Credit Card
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="debit-card" id="debit-card" />
                <Label htmlFor="debit-card" className="flex items-center cursor-pointer flex-1">
                  <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                  Debit Card
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex items-center cursor-pointer flex-1">
                  <Smartphone className="h-5 w-5 mr-2 text-purple-600" />
                  UPI
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="netbanking" id="netbanking" />
                <Label htmlFor="netbanking" className="flex items-center cursor-pointer flex-1">
                  <Building className="h-5 w-5 mr-2 text-orange-600" />
                  Net Banking
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Details Form */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(paymentMethod === "credit-card" || paymentMethod === "debit-card") && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.number}
                  onChange={(e) => handleCardInputChange("number", e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) => handleCardInputChange("expiry", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={(e) => handleCardInputChange("cvv", e.target.value)}
                    type="password"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="card-name">Cardholder Name</Label>
                <Input
                  id="card-name"
                  placeholder="Enter name as on card"
                  value={cardData.name}
                  onChange={(e) => handleCardInputChange("name", e.target.value)}
                />
              </div>
            </div>
          )}

          {paymentMethod === "upi" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upi-id">UPI ID</Label>
                <Input
                  id="upi-id"
                  placeholder="yourname@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
              <div className="text-sm text-gray-600">
                Enter your UPI ID (e.g., yourname@paytm, yourname@gpay, yourname@phonepe)
              </div>
            </div>
          )}

          {paymentMethod === "netbanking" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Your Bank</Label>
                <RadioGroup value={selectedBank} onValueChange={setSelectedBank}>
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                    {banks.map((bank) => (
                      <div key={bank} className="flex items-center space-x-2 p-2 border rounded">
                        <RadioGroupItem value={bank} id={bank} />
                        <Label htmlFor={bank} className="cursor-pointer text-sm">
                          {bank}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          onClick={handlePayment}
          disabled={!isFormValid() || isProcessing}
          className="w-full h-12 text-lg"
        >
          {isProcessing ? "Processing..." : `Pay ${formatPrice(amount)}`}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onPaymentCancel}
          disabled={isProcessing}
          className="w-full"
        >
          Cancel
        </Button>
      </div>

      {/* Security Info */}
      <div className="text-xs text-gray-500 text-center p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center mb-1">
          <Wallet className="h-4 w-4 mr-1" />
          Secure Payment
        </div>
        Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
      </div>
    </div>
  );
};

export default PaymentGateway;

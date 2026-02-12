import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Package, MapPin, CreditCard, Truck, ShoppingBag } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/ClerkAuthBridge";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [processing, setProcessing] = useState(true);

  React.useEffect(() => {
    const processOrder = async () => {
      const pendingOrderStr = localStorage.getItem('pendingOrder');
      if (pendingOrderStr) {
        try {
          const pendingOrder = JSON.parse(pendingOrderStr);

          // Prepare order data for Supabase
          const orderData = {
            user_id: user?.uid || 'guest',
            total_amount: pendingOrder.total,
            status: 'Paid',
            items: pendingOrder.items || [],
            shipping_address: pendingOrder.address || {},
            payment_intent_id: pendingOrder.paymentId || `PAY-${Date.now()}`
          };

          // Insert order into Supabase
          const { data: orderResponse, error: orderError } = await supabase
            .from('orders')
            .insert(orderData)
            .select()
            .single();

          if (orderError) throw orderError;

          // Insert order items
          if (pendingOrder.items && pendingOrder.items.length > 0) {
            const orderItems = pendingOrder.items.map((item: any) => ({
              order_id: orderResponse.id,
              product_id: item.id,
              product_name: item.title,
              product_price: item.price,
              price_at_purchase: item.price,
              quantity: item.quantity
            }));

            const { error: itemsError } = await supabase
              .from('order_items')
              .insert(orderItems);

            if (itemsError) throw itemsError;
          }

          // Store order details for display
          setOrderDetails({
            id: orderResponse.id,
            items: pendingOrder.items || [],
            total: pendingOrder.total,
            address: pendingOrder.address || {},
            paymentMethod: 'Online Payment',
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
          });

          // Update localStorage for legacy support
          const completedOrder = {
            ...pendingOrder,
            id: orderResponse.id,
            status: 'Paid',
            paymentId: orderData.payment_intent_id
          };

          const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
          orderHistory.push(completedOrder);
          localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

          // Clear pending order and cart
          localStorage.removeItem('pendingOrder');
          localStorage.setItem('cart', JSON.stringify([]));

        } catch (error) {
          console.error("Error processing pending order:", error);
        }
      }
      setProcessing(false);
    };

    processOrder();
  }, [user]);

  // Estimated delivery date (3-5 business days)
  const getEstimatedDelivery = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 3);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 5);
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return `${minDate.toLocaleDateString('en-IN', opts)} - ${maxDate.toLocaleDateString('en-IN', opts)}`;
  };

  if (processing) {
    return (
      <MobileLayout>
        <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Processing your order...</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="p-4 pb-24">
        {/* Success Header */}
        <div className="flex flex-col items-center text-center mb-6 pt-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3 animate-bounce">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-700">Payment Successful!</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Thank you for your purchase
          </p>
        </div>

        {orderDetails && (
          <>
            {/* Order ID */}
            <Card className="mb-3 border-green-100 bg-green-50/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Order ID</span>
                  </div>
                  <span className="text-sm font-mono text-green-700">{orderDetails.id?.substring(0, 8).toUpperCase()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card className="mb-3">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  <h3 className="font-medium text-sm">Items Ordered</h3>
                </div>
                <div className="space-y-2">
                  {orderDetails.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm py-1 border-b last:border-0">
                      <div>
                        <span className="font-medium">{item.title || item.name}</span>
                        <span className="text-muted-foreground ml-1">x{item.quantity}</span>
                      </div>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 pt-2 border-t font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{orderDetails.total}</span>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <Card className="mb-3">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Truck className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Estimated Delivery</p>
                      <p className="text-sm text-muted-foreground">{getEstimatedDelivery()}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CreditCard className="h-4 w-4 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Payment Method</p>
                      <p className="text-sm text-muted-foreground">{orderDetails.paymentMethod}</p>
                    </div>
                  </div>
                  {orderDetails.address && orderDetails.address.name && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Shipping To</p>
                        <p className="text-sm text-muted-foreground">
                          {orderDetails.address.name}, {orderDetails.address.address}
                          {orderDetails.address.city && `, ${orderDetails.address.city}`}
                          {orderDetails.address.pincode && ` - ${orderDetails.address.pincode}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 mt-6">
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => navigate("/profile")}
          >
            <Package className="h-4 w-4 mr-2" />
            View My Orders
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

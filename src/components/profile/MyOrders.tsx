
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, MapPin, X, CreditCard, Truck, Clock, Check, Home } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useAuth } from "@/context/ClerkAuthBridge";

// Status badge component with color coding
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (s: string) => {
    switch (s?.toLowerCase()) {
      case 'paid':
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'Paid' };
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' };
      case 'processing':
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Processing' };
      case 'shipped':
        return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Shipped' };
      case 'delivered':
        return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Delivered' };
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: status || 'Unknown' };
    }
  };

  const config = getStatusConfig(status);
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

const OrderTimeline = ({ status, date }: { status: string, date: string }) => {
  if (status === 'cancelled') {
    return (
      <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">
        <X className="h-4 w-4" />
        Order has been cancelled
      </div>
    );
  }

  const steps = [
    { id: 'ordered', label: 'Ordered', icon: Package },
    { id: 'processing', label: 'Processing', icon: Clock },
    { id: 'shipped', label: 'Shipped', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: Home },
  ];

  const getStepStatus = (stepId: string) => {
    const s = status?.toLowerCase() || 'pending';

    // Define progress mapping
    const progress: Record<string, number> = {
      'pending': 1,
      'paid': 1,
      'processing': 2,
      'shipped': 3,
      'delivered': 4
    };

    const currentLevel = progress[s] || 0;
    const stepLevel = progress[stepId] || 0;

    if (stepLevel < currentLevel) return 'completed';
    if (stepLevel === currentLevel) return 'current';
    return 'upcoming';
  };

  return (
    <div className="mb-6 px-1">
      <div className="relative flex items-center justify-between">
        {/* Connector Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />

        {steps.map((step, idx) => {
          const stepStatus = getStepStatus(step.id);
          const isCompleted = stepStatus === 'completed';
          const isCurrent = stepStatus === 'current';
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center bg-white px-2">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                ${isCompleted ? 'bg-green-500 border-green-500 text-white' :
                  isCurrent ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-110' :
                    'bg-white border-gray-300 text-gray-300'}
              `}>
                {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span className={`
                text-[10px] sm:text-xs font-medium mt-1
                ${isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'}
              `}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MyOrders = () => {
  const { user } = useAuth();
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Map database fields to UI component expected format
        const formattedOrders = ((data as any) || []).map((order: any) => ({
          id: order.id,
          date: new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          total: order.total_amount,
          status: order.status,
          items: (order.order_items && order.order_items.length > 0) ? order.order_items : (order.items || []),
          paymentMethod: order.payment_method || 'Online Payment',
          shippingAddress: order.shipping_address || null
        }));

        setOrderHistory(formattedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId: string) => {
    setCancellingId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setOrderHistory(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );

      toast({
        title: "Order Cancelled",
        description: "Your order has been cancelled successfully."
      });
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Error",
        description: "Failed to cancel order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCancellingId(null);
    }
  };

  const handleTrackOrder = (orderId: string) => {
    toast({
      title: "Tracking Order",
      description: `Tracking information for order ${orderId.substring(0, 8).toUpperCase()} - Expected delivery: 3-5 business days`
    });
  };

  // Estimated delivery helper
  const getEstimatedDelivery = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 3);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 5);
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return `${minDate.toLocaleDateString('en-IN', opts)} - ${maxDate.toLocaleDateString('en-IN', opts)}`;
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (orderHistory.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="font-medium">No orders yet</p>
        <p className="text-sm mt-1">Your orders will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orderHistory.map((order: any) => (
        <Collapsible key={order.id} className="border rounded-xl overflow-hidden">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm">{order.id.substring(0, 8).toUpperCase()}</h3>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {order.date} • ₹{order.total}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 border-t bg-gray-50/50 pt-4">
              {/* Timeline */}
              <OrderTimeline status={order.status} date={order.date} />

              {/* Items */}
              <div className="mt-3">
                <h4 className="font-medium text-xs text-gray-500 uppercase tracking-wide mb-2">Items</h4>
                <div className="space-y-2">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm bg-white p-2 rounded-lg">
                      <div>
                        <span className="font-medium">{item.title || item.product_name || item.name}</span>
                        <span className="text-muted-foreground ml-1">x{item.quantity}</span>
                      </div>
                      <span className="font-medium">₹{(item.price || item.product_price || item.price_at_purchase) * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="mt-3 space-y-2">
                {/* Total */}
                <div className="flex justify-between items-center py-2 border-t font-bold text-sm">
                  <span>Total</span>
                  <span className="text-primary">₹{order.total}</span>
                </div>

                {/* Payment Method */}
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-3.5 w-3.5 text-purple-500" />
                  <span className="text-gray-600">{order.paymentMethod}</span>
                </div>

                {/* Estimated Delivery */}
                {!['cancelled', 'delivered'].includes(order.status?.toLowerCase()) && (
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-gray-600">Est. delivery: {getEstimatedDelivery()}</span>
                  </div>
                )}

                {/* Shipping Address */}
                {order.shippingAddress && typeof order.shippingAddress === 'object' && order.shippingAddress.name && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-red-500 mt-0.5" />
                    <span className="text-gray-600">
                      {order.shippingAddress.name}, {order.shippingAddress.address || order.shippingAddress.houseNo}
                      {order.shippingAddress.city && `, ${order.shippingAddress.city}`}
                      {order.shippingAddress.pincode && ` - ${order.shippingAddress.pincode}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                {!['cancelled', 'delivered'].includes(order.status?.toLowerCase()) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTrackOrder(order.id)}
                    className="flex-1 text-xs"
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    Track
                  </Button>
                )}
                {['pending', 'paid'].includes(order.status?.toLowerCase()) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCancelOrder(order.id)}
                    className="flex-1 text-xs text-red-600 border-red-200 hover:bg-red-50"
                    disabled={cancellingId === order.id}
                  >
                    {cancellingId === order.id ? (
                      <span className="animate-pulse">Cancelling...</span>
                    ) : (
                      <>
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default MyOrders;

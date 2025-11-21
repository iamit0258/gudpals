
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, MapPin, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MyOrders = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedOrders = localStorage.getItem('orderHistory');
    if (storedOrders) {
      setOrderHistory(JSON.parse(storedOrders));
    } else {
      const mockOrders = [
        {
          id: "ORD-001",
          date: "2025-12-15",
          total: 99.99,
          status: "Delivered",
          items: [
            { name: "Pillow", quantity: 2, price: 49.99 }
          ]
        },
      ];
      setOrderHistory(mockOrders);
      localStorage.setItem('orderHistory', JSON.stringify(mockOrders));
    }
  }, []);

  const handleCancelOrder = (orderId: string) => {
    const updatedOrders = orderHistory.map(order => 
      order.id === orderId ? { ...order, status: 'Cancelled' } : order
    );
    setOrderHistory(updatedOrders);
    localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
    toast({
      title: "Order Cancelled",
      description: `Order ${orderId} has been cancelled successfully.`
    });
  };

  const handleTrackOrder = (orderId: string) => {
    toast({
      title: "Tracking Order",
      description: `Tracking information for order ${orderId} - Expected delivery: 2-3 business days`
    });
  };

  if (orderHistory.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orderHistory.map((order: any) => (
        <Collapsible key={order.id} className="border rounded-lg p-3">
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Package className="h-5 w-5 mr-3 text-blue-600" />
              <div className="text-left">
                <h3 className="font-medium">{order.id}</h3>
                <p className="text-sm text-gray-500">
                  {order.date} • ₹{order.total} • {order.status}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-3 pt-3 border-t">
              <h4 className="font-medium mb-2">Order Items:</h4>
              <div className="space-y-2">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₹{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t">
                <div className="flex justify-between font-medium mb-3">
                  <span>Total</span>
                  <span>₹{order.total}</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleTrackOrder(order.id)}
                    className="flex-1"
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Track Order
                  </Button>
                  {order.status === 'Processing' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCancelOrder(order.id)}
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default MyOrders;

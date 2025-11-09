import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CreditCard, Truck, ShieldCheck, CheckCircle, Home, Navigation, Trash } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/ClerkAuthBridge";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const { user } = useAuth();
  
  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart data:", e);
      }
    }
  }, []);
  
  const form = useForm({
    defaultValues: {
      paymentMethod: "online",
      addressType: "home",
      name: "",
      phone: "",
      address: "",
      city: "",
      pincode: ""
    }
  });
  
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const calculateDeliveryFee = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 1000 ? 0 : 40;
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee();
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    
    // Update localStorage with updated cart
    localStorage.setItem('cart', JSON.stringify(cartItems.filter(item => item.id !== id)));
    
    toast({
      title: t("item_removed"),
      description: t("item_removed_from_cart"),
    });
    
    if (cartItems.length <= 1) {
      setTimeout(() => {
        navigate("/products");
      }, 1000);
    }
  };
  
  const handleSubmit = async (data: any) => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some products to your cart before checking out.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Check payment method and proceed accordingly
      if (data.paymentMethod === "online") {
        // Process Stripe payment for cart items (guest-friendly)
        const response = await supabase.functions.invoke('create-payment', {
          body: { 
            cartItems: cartItems.map(item => ({
              title: item.title,
              price: item.price,
              quantity: item.quantity,
              id: item.id
            })),
            userEmail: user?.email || undefined,
          }
        });

        if (response.error) throw response.error;

        if (response.data?.url) {
          // Clear cart and redirect to Stripe
          localStorage.setItem('cart', JSON.stringify([]));
          window.location.href = response.data.url;
        }
      } else {
        // Cash on delivery - process order directly
        setOrderComplete(true);
        
        // Store the order in localStorage for demo purposes
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        const newOrder = {
          id: Date.now(),
          items: cartItems,
          address: data,
          total: calculateTotal(),
          status: 'Processing',
          date: new Date().toISOString(),
          paymentMethod: 'Cash on Delivery'
        };
        
        orderHistory.push(newOrder);
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
        
        // Clear cart after successful order
        localStorage.setItem('cart', JSON.stringify([]));
        
        toast({
          title: t("order_placed"),
          description: t("order_success_message"),
        });
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (orderComplete) {
    return (
      <MobileLayout>
        <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{t("order_successful")}</h1>
          <p className="text-muted-foreground mb-6">
            {t("order_confirmation_message")}
          </p>
          <p className="text-sm mb-8">
            {t("order_confirmation_email")}
          </p>
          <Button
            className="mb-2 w-full max-w-xs bg-primary hover:bg-dhayan-teal-dark text-white"
            onClick={() => navigate("/products")}
          >
            {t("continue_shopping")}
          </Button>
          <Button
            variant="outline"
            className="w-full max-w-xs"
            onClick={() => navigate("/")}
          >
            {t("go_to_home")}
          </Button>
        </div>
      </MobileLayout>
    );
  }
  
  return (
    <MobileLayout>
      <div className="pb-24">
        <div className="p-4 border-b">
          <Button variant="ghost" onClick={() => navigate("/products")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("back_to_products")}
          </Button>
          <h1 className="text-2xl font-bold mt-2">{t("checkout")}</h1>
        </div>
        
        {/* Cart Items */}
        <div className="p-4">
          <h2 className="font-medium mb-2">{t("items_in_cart")}</h2>
          
          {cartItems.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-muted-foreground">{t("cart_empty")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex">
                      <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 mr-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm line-clamp-1">{item.title}</h3>
                        <div className="flex justify-between items-center mt-1">
                          <p className="font-bold text-primary">{formatPrice(item.price)}</p>
                          <div className="flex items-center">
                            <span className="text-sm mr-3">x{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="p-4 border-t border-b">
          <h2 className="font-medium mb-3">{t("order_summary")}</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("subtotal")}</span>
              <span>{formatPrice(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("delivery_fee")}</span>
              <span>{calculateDeliveryFee() === 0 ? t("free") : formatPrice(calculateDeliveryFee())}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-medium">
              <span>{t("total")}</span>
              <span className="text-primary">{formatPrice(calculateTotal())}</span>
            </div>
          </div>
        </div>
        
        {/* Payment and Delivery */}
        <div className="p-4 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Payment Method */}
              <div>
                <h2 className="font-medium mb-3">{t("payment_method")}</h2>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <Card className={`cursor-pointer ${field.value === 'online' ? 'border-primary' : ''}`}>
                            <CardContent className="p-3 flex items-center">
                              <RadioGroupItem value="online" id="online" className="mr-3" />
                              <FormLabel htmlFor="online" className="flex-1 cursor-pointer">
                                <div className="flex items-center">
                                  <CreditCard className="h-4 w-4 mr-2 text-dhayan-purple" />
                                  <span>{t("online_payment")}</span>
                                </div>
                                <p className="text-xs text-gray-500 ml-6">Credit Card, Debit Card, UPI, Net Banking</p>
                              </FormLabel>
                            </CardContent>
                          </Card>
                          <Card className={`cursor-pointer ${field.value === 'cod' ? 'border-primary' : ''}`}>
                            <CardContent className="p-3 flex items-center">
                              <RadioGroupItem value="cod" id="cod" className="mr-3" />
                              <FormLabel htmlFor="cod" className="flex-1 cursor-pointer">
                                <div className="flex items-center">
                                  <CreditCard className="h-4 w-4 mr-2 text-dhayan-teal" />
                                  <span>{t("cash_on_delivery")}</span>
                                </div>
                              </FormLabel>
                            </CardContent>
                          </Card>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Delivery Address */}
              <div>
                <h2 className="font-medium mb-3">{t("delivery_address")}</h2>
                <FormField
                  control={form.control}
                  name="addressType"
                  render={({ field }) => (
                    <FormItem className="space-y-2 mb-4">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-3"
                        >
                          <Card className={`flex-1 cursor-pointer ${field.value === 'home' ? 'border-primary' : ''}`}>
                            <CardContent className="p-2 flex flex-col items-center justify-center">
                              <RadioGroupItem value="home" id="home" className="sr-only" />
                              <FormLabel htmlFor="home" className="cursor-pointer text-center">
                                <Home className="h-4 w-4 mx-auto mb-1" />
                                <span className="text-sm">{t("home")}</span>
                              </FormLabel>
                            </CardContent>
                          </Card>
                          <Card className={`flex-1 cursor-pointer ${field.value === 'work' ? 'border-primary' : ''}`}>
                            <CardContent className="p-2 flex flex-col items-center justify-center">
                              <RadioGroupItem value="work" id="work" className="sr-only" />
                              <FormLabel htmlFor="work" className="cursor-pointer text-center">
                                <Navigation className="h-4 w-4 mx-auto mb-1" />
                                <span className="text-sm">{t("work")}</span>
                              </FormLabel>
                            </CardContent>
                          </Card>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">{t("full_name")}</label>
                      <Input {...form.register("name")} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">{t("phone_number")}</label>
                      <Input {...form.register("phone")} />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium">{t("address")}</label>
                    <Textarea 
                      {...form.register("address")} 
                      className="resize-none" 
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">{t("city")}</label>
                      <Input {...form.register("city")} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">{t("pincode")}</label>
                      <Input {...form.register("pincode")} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="pt-2 grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs mt-1">{t("fast_delivery")}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs mt-1">{t("secure_payment")}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs mt-1">{t("easy_returns")}</span>
                </div>
              </div>
            </form>
          </Form>
        </div>
        
        {/* Submit Button - Fixed at bottom with proper spacing */}
        <div className="fixed bottom-16 left-0 right-0 bg-white p-4 border-t max-w-md mx-auto">
          <Button 
            onClick={form.handleSubmit(handleSubmit)}
            className="w-full bg-primary hover:bg-dhayan-teal-dark text-white"
            disabled={loading || cartItems.length === 0}
          >
            {loading ? t("processing") : t("place_order")}
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Checkout;

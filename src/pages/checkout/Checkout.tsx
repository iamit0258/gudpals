import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CreditCard, Truck, ShieldCheck, CheckCircle, Home, Navigation, Trash, MapPin, Package, ShoppingBag, Minus, Plus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/ClerkAuthBridge";
import { useAddresses } from "@/hooks/useAddresses";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const checkoutSchema = z.object({
  paymentMethod: z.enum(["online", "cod"]),
  addressType: z.enum(["home", "work"]),
  name: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Valid phone number is required").max(15),
  houseNo: z.string().min(1, "House/Flat No. is required"),
  address: z.string().min(5, "Street address is required"),
  landmark: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits")
});

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

type CheckoutValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrderDetails, setCompletedOrderDetails] = useState<any>(null);
  const { user } = useAuth();
  const { addresses, addAddress } = useAddresses();
  const [saveAddress, setSaveAddress] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");

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

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "online",
      addressType: "home",
      name: "",
      phone: "",
      houseNo: "",
      address: "",
      landmark: "",
      city: "",
      state: "",
      pincode: ""
    }
  });

  // Effect to set default address if available and no address selected yet
  useEffect(() => {
    if (addresses.length > 0 && selectedAddressId === "new" && !form.getValues("name")) {
      const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        fillFormWithAddress(defaultAddress);
      }
    }
  }, [addresses]);

  const fillFormWithAddress = (address: any) => {
    form.setValue("name", address.name || "");
    form.setValue("phone", address.phone || "");
    form.setValue("houseNo", address.house_no || "");
    form.setValue("address", address.street || "");
    form.setValue("landmark", address.landmark || "");
    form.setValue("city", address.city || "");
    form.setValue("state", address.state || "");
    form.setValue("pincode", address.pincode || "");
    form.setValue("addressType", address.type || "home");
  };

  const handleAddressSelect = (value: string) => {
    setSelectedAddressId(value);
    if (value === "new") {
      form.reset({
        paymentMethod: form.getValues("paymentMethod"),
        addressType: "home",
        name: "",
        phone: "",
        houseNo: "",
        address: "",
        landmark: "",
        city: "",
        state: "",
        pincode: ""
      });
      setSaveAddress(true);
    } else {
      const address = addresses.find(a => a.id === value);
      if (address) {
        fillFormWithAddress(address);
        setSaveAddress(false); // Don't save if selecting existing
      }
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDeliveryFee = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 499 ? 0 : 40;
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

  const handleUpdateQuantity = (id: number, delta: number) => {
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, Math.min(10, item.quantity + delta)) } : item
    );
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
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

    // Save address if requested and it's a new address (or manually checked)
    if (saveAddress && selectedAddressId === "new") {
      addAddress({
        name: data.name,
        street: data.address,
        house_no: data.houseNo,
        landmark: data.landmark,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        isDefault: addresses.length === 0,
        phone: data.phone,
        type: data.addressType as any
      });
    }

    try {
      // Check payment method and proceed accordingly
      if (data.paymentMethod === "online") {
        // Create a pending order to be finalized on success page
        const pendingOrder = {
          id: Date.now(),
          items: cartItems,
          address: data,
          total: calculateTotal(),
          status: 'Processing', // Will be confirmed on success page
          date: new Date().toISOString(),
          paymentMethod: 'Online Payment'
        };
        localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));

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

        // Prepare order data
        const orderData = {
          user_id: user?.uid || 'guest',
          total_amount: calculateTotal(),
          status: 'pending',
          payment_method: 'Cash on Delivery',
          items: cartItems.map(item => ({ id: item.id, title: item.title, price: item.price, quantity: item.quantity })),
          shipping_address: { name: data.name, phone: data.phone, houseNo: data.houseNo, address: data.address, landmark: data.landmark, city: data.city, state: data.state, pincode: data.pincode },
          payment_intent_id: `COD-${Date.now()}`
        };

        // Insert into Supabase
        const { data: orderResponse, error: orderError } = await supabase
          .from('orders')
          .insert(orderData)
          .select()
          .single();

        if (orderError) throw orderError;

        // Insert items into order_items table
        if (cartItems.length > 0) {
          const orderItems = cartItems.map(item => ({
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

        // Store completed order details for confirmation page
        setCompletedOrderDetails({
          id: orderResponse.id,
          items: cartItems.map(item => ({ title: item.title, price: item.price, quantity: item.quantity })),
          total: calculateTotal(),
          address: { name: data.name, phone: data.phone, address: data.address, city: data.city, pincode: data.pincode },
          paymentMethod: 'Cash on Delivery'
        });

        setOrderComplete(true);

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

  if (orderComplete) {
    return (
      <MobileLayout>
        <div className="p-4 pb-24">
          {/* Success Header */}
          <div className="flex flex-col items-center text-center mb-6 pt-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3 animate-bounce">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-700">{t("order_successful")}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t("order_confirmation_message")}</p>
          </div>

          {completedOrderDetails && (
            <>
              {/* Order ID */}
              <Card className="mb-3 border-green-100 bg-green-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Order ID</span>
                    </div>
                    <span className="text-sm font-mono text-green-700">{completedOrderDetails.id?.substring(0, 8).toUpperCase()}</span>
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
                    {completedOrderDetails.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-sm py-1 border-b last:border-0">
                        <div>
                          <span className="font-medium">{item.title}</span>
                          <span className="text-muted-foreground ml-1">x{item.quantity}</span>
                        </div>
                        <span className="font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{completedOrderDetails.total}</span>
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
                        <p className="text-sm text-muted-foreground">{completedOrderDetails.paymentMethod}</p>
                      </div>
                    </div>
                    {completedOrderDetails.address && completedOrderDetails.address.name && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Shipping To</p>
                          <p className="text-sm text-muted-foreground">
                            {completedOrderDetails.address.name}, {completedOrderDetails.address.address}
                            {completedOrderDetails.address.city && `, ${completedOrderDetails.address.city}`}
                            {completedOrderDetails.address.pincode && ` - ${completedOrderDetails.address.pincode}`}
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
              {t("continue_shopping")}
            </Button>
          </div>
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
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-6 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                              disabled={item.quantity >= 10}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 ml-1"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash className="h-3.5 w-3.5" />
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
              <span className="text-muted-foreground">{t("shipping_fee")}</span>
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
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-medium">{t("delivery_address")}</h2>
                </div>

                {addresses.length > 0 && (
                  <div className="mb-4">
                    <Label className="text-sm text-muted-foreground mb-2 block">Select Saved Address</Label>
                    <Select value={selectedAddressId} onValueChange={handleAddressSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an address" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Add New Address</SelectItem>
                        {addresses.map((addr) => (
                          <SelectItem key={addr.id} value={addr.id}>
                            {addr.name} - {addr.street}, {addr.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="addressType"
                  render={({ field }) => (
                    <FormItem className="space-y-2 mb-4">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
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

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("full_name")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("phone_number")}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. 9876543210" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="houseNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>House / Flat No.</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. Flat 402" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="landmark"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Landmark (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. Near Park" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address / Area</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="resize-none"
                            rows={2}
                            placeholder="Street name, locality, etc."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("city")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("pincode")}</FormLabel>
                          <FormControl>
                            <Input {...field} maxLength={6} placeholder="6 digits" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {indianStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedAddressId === "new" && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="saveAddress"
                        checked={saveAddress}
                        onCheckedChange={(checked) => setSaveAddress(checked as boolean)}
                      />
                      <Label htmlFor="saveAddress" className="text-sm cursor-pointer">
                        Save this address for future use
                      </Label>
                    </div>
                  )}
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

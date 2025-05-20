
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Users, Clock, Filter, Star, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";
import { useLanguage } from "@/context/language/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const Products = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { registerForActivity } = useAuth();
  const { t, language } = useLanguage();
  const [cartOpen, setCartOpen] = React.useState(false);
  const [cart, setCart] = React.useState<any[]>([]);
  
  // Load cart from localStorage
  React.useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart data:", e);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  React.useEffect(() => {
    if (location.state?.registered && location.state?.activityName) {
      toast({
        title: t("purchase_successful"),
        description: `${t("successfully_ordered")} ${location.state.activityName}`,
      });
      
      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, navigate, t]);
  
  const products = [
    {
      id: 1,
      title_en: "Senior-Friendly Smartphone",
      title_hi: "सीनियर-फ्रेंडली स्मार्टफोन",
      description_en: "Large buttons and simple interface for easy navigation.",
      description_hi: "बड़े बटन और सरल इंटरफेस के साथ आसान नेविगेशन।",
      users: 156,
      availability: t("in_stock"),
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=300&auto=format&fit=crop",
      category: t("electronics"),
      reviews: 42,
      rating: 4.6,
      price: 5999
    },
    {
      id: 2,
      title_en: "Meditation Cushion Set",
      title_hi: "ध्यान कुशन सेट",
      description_en: "Comfortable cushions for your daily meditation practice.",
      description_hi: "आपके दैनिक ध्यान अभ्यास के लिए आरामदायक कुशन।",
      users: 89,
      availability: t("limited_stock"),
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=300&auto=format&fit=crop",
      category: t("wellness"),
      reviews: 28,
      rating: 4.8,
      price: 1499
    },
    {
      id: 3,
      title_en: "Arthritis-Friendly Utensils",
      title_hi: "गठिया के अनुकूल बर्तन",
      description_en: "Specially designed for better grip and comfort.",
      description_hi: "बेहतर पकड़ और आराम के लिए विशेष रूप से डिज़ाइन किया गया।",
      users: 203,
      availability: t("in_stock"),
      image: "https://images.unsplash.com/photo-1630324982388-c15f371bf8c2?q=80&w=300&auto=format&fit=crop",
      category: t("kitchen"),
      reviews: 56,
      rating: 4.3,
      price: 899
    },
  ];

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };
  
  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Update quantity if already in cart
      const updatedCart = cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([...cart, {
        id: product.id,
        title: language === "en" ? product.title_en : product.title_hi,
        price: product.price,
        image: product.image,
        quantity: 1
      }]);
    }
    
    toast({
      title: t("added_to_cart"),
      description: `${language === "en" ? product.title_en : product.title_hi} ${t("added_to_cart_success")}`,
    });
  };
  
  const handleBuyNow = (product) => {
    // Add to cart first
    handleAddToCart(product);
    // Navigate to checkout
    navigate("/checkout");
  };
  
  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
    
    toast({
      title: t("item_removed"),
      description: t("item_removed_from_cart"),
    });
  };
  
  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };
  
  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-dhayan-purple-dark">{t("senior_products")}</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalCartItems()}
                </span>
              )}
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              {t("filter")}
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-32">
                <img 
                  src={product.image} 
                  alt={language === "en" ? product.title_en : product.title_hi}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-dhayan-purple text-white text-xs px-2 py-1 rounded-full">
                  {product.category}
                </div>
                <div className="absolute bottom-2 left-2 bg-white/70 backdrop-blur-sm font-bold text-primary px-2 py-1 rounded-lg">
                  {formatPrice(product.price)}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">
                  {language === "en" ? product.title_en : product.title_hi}
                </h3>
                <p className="text-sm text-dhayan-gray mt-1">
                  {language === "en" ? product.description_en : product.description_hi}
                </p>
                
                <div className="flex items-center mt-3 text-xs text-dhayan-gray-dark">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span className="mr-3">{product.users} {t("users")}</span>
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span className="mr-3">{product.availability}</span>
                  <Star className="h-3.5 w-3.5 mr-1 text-amber-500" />
                  <span>{product.rating} ({product.reviews} {t("reviews")})</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
                <Button 
                  variant="secondary"
                  className="w-full border-primary text-primary flex items-center justify-center"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {t("add_to_cart")}
                </Button>
                <Button 
                  className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white flex items-center justify-center"
                  onClick={() => handleBuyNow(product)}
                >
                  <Package className="h-4 w-4 mr-2" />
                  {t("buy_now")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Cart Dialog */}
      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("your_cart")}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <p className="text-muted-foreground">{t("cart_empty")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center border-b pb-3">
                    <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <p className="font-bold text-primary text-sm">
                          {formatPrice(item.price)} x {item.quantity}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-red-500"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          <Star className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">{t("total")}</span>
                  <span className="font-bold text-primary">
                    {formatPrice(calculateCartTotal())}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setCartOpen(false)}
            >
              {t("continue_shopping")}
            </Button>
            <Button 
              className="flex-1 bg-primary"
              onClick={() => {
                setCartOpen(false);
                navigate("/checkout");
              }}
              disabled={cart.length === 0}
            >
              {t("checkout")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default Products;

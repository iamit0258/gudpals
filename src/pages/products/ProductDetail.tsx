
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft, Star, Plus, Minus, Check, MessageSquare, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const mockProducts = {
  "1": {
    id: 1,
    title_en: "Senior-Friendly Smartphone",
    title_hi: "सीनियर-फ्रेंडली स्मार्टफोन",
    description_en: "Our specially designed smartphone features large buttons, simplified interface, and enhanced accessibility features. Perfect for seniors who want to stay connected without the complexity of regular smartphones.",
    description_hi: "हमारे विशेष रूप से डिज़ाइन किए गए स्मार्टफोन में बड़े बटन, सरल इंटरफेस और बेहतर पहुंच सुविधाएं हैं। उन वरिष्ठ नागरिकों के लिए आदर्श जो नियमित स्मार्टफोन की जटिलता के बिना जुड़े रहना चाहते हैं।",
    price: 5999,
    rating: 4.8,
    reviews: 156,
    features_en: [
      "Extra large display and buttons",
      "Simplified interface with essential functions",
      "Emergency SOS button",
      "Long-lasting battery",
      "Hearing aid compatibility"
    ],
    features_hi: [
      "अतिरिक्त बड़ा डिस्प्ले और बटन",
      "आवश्यक कार्यों के साथ सरल इंटरफेस",
      "आपातकालीन SOS बटन",
      "लंबे समय तक चलने वाली बैटरी",
      "हियरिंग एड कंपैटिबिलिटी"
    ],
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=300&auto=format&fit=crop"
    ],
    category: "Electronics",
    inStock: true
  },
  "2": {
    id: 2,
    title_en: "Meditation Cushion Set",
    title_hi: "ध्यान कुशन सेट",
    description_en: "Created with seniors in mind, this meditation cushion set provides proper support for longer meditation sessions. The set includes a comfortable seat cushion and a support cushion for your knees.",
    description_hi: "वरिष्ठ नागरिकों को ध्यान में रखकर बनाया गया, यह ध्यान कुशन सेट लंबे ध्यान सत्रों के लिए उचित समर्थन प्रदान करता है। सेट में एक आरामदायक सीट कुशन और आपके घुटनों के लिए एक सहायक कुशन शामिल है।",
    price: 1499,
    rating: 4.5,
    reviews: 89,
    features_en: [
      "Ergonomic design for comfortable sitting",
      "Made with eco-friendly materials",
      "Easy to clean covers",
      "Provides proper spine alignment",
      "Available in calming colors"
    ],
    features_hi: [
      "आरामदायक बैठने के लिए एर्गोनोमिक डिज़ाइन",
      "पर्यावरण के अनुकूल सामग्री से बना",
      "आसानी से साफ होने वाले कवर",
      "उचित रीढ़ संरेखण प्रदान करता है",
      "शांत रंगों में उपलब्ध"
    ],
    images: [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=300&auto=format&fit=crop"
    ],
    category: "Wellness",
    inStock: true
  },
  "3": {
    id: 3,
    title_en: "Arthritis-Friendly Utensils",
    title_hi: "गठिया के अनुकूल बर्तन",
    description_en: "These specially designed utensils make eating easier for those with arthritis or limited hand mobility. The ergonomic handles provide a comfortable grip while the lightweight design reduces strain.",
    description_hi: "ये विशेष रूप से डिज़ाइन किए गए बर्तन गठिया या सीमित हाथ की गतिशीलता वाले लोगों के लिए खाना आसान बनाते हैं। एर्गोनोमिक हैंडल आरामदायक पकड़ प्रदान करते हैं जबकि हल्के डिज़ाइन तनाव को कम करता है।",
    price: 899,
    rating: 4.9,
    reviews: 203,
    features_en: [
      "Ergonomic grip design",
      "Lightweight construction",
      "Dishwasher safe",
      "BPA-free materials",
      "Set includes knife, fork, spoon, and adaptive handles"
    ],
    features_hi: [
      "एर्गोनोमिक ग्रिप डिज़ाइन",
      "हल्का निर्माण",
      "डिशवॉशर सेफ",
      "BPA-मुक्त सामग्री",
      "सेट में चाकू, कांटा, चम्मच और अनुकूली हैंडल शामिल हैं"
    ],
    images: [
      "https://images.unsplash.com/photo-1630324982388-c15f371bf8c2?q=80&w=300&auto=format&fit=crop"
    ],
    category: "Kitchen",
    inStock: true
  }
};

// Sample reviews data
const sampleReviews = [
  {
    id: 1,
    productId: 1,
    userName: "Priya Sharma",
    rating: 5,
    text: "This smartphone is perfect for my father. The buttons are large and easy to press, and the interface is very simple to understand.",
    date: "2024-03-15"
  },
  {
    id: 2,
    productId: 1,
    userName: "Rajesh Kumar",
    rating: 4,
    text: "Very good product. Battery life is excellent. The only downside is that it could use a better camera.",
    date: "2024-02-28"
  },
  {
    id: 3,
    productId: 2,
    userName: "Ananya Patel",
    rating: 5,
    text: "These meditation cushions are so comfortable. They have helped me maintain my posture during long meditation sessions.",
    date: "2024-03-10"
  }
];

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState(sampleReviews);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // In a real app, you would fetch this data
  const product = mockProducts[productId as keyof typeof mockProducts];
  
  // Load cart from localStorage on mount
  useEffect(() => {
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
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  if (!product) {
    return (
      <MobileLayout>
        <div className="p-4">
          <Button variant="ghost" onClick={() => navigate("/products")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("back_to_products")}
          </Button>
          <div className="mt-8 text-center">
            <p>{t("product_not_found")}</p>
          </div>
        </div>
      </MobileLayout>
    );
  }
  
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    
    // Simulate network delay
    setTimeout(() => {
      const cartItem = {
        id: product.id,
        title: getLocalizedTitle(),
        price: product.price,
        quantity: quantity,
        image: product.images[0]
      };
      
      // Check if the product is already in the cart
      const existingItemIndex = cart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if already in cart
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += quantity;
        setCart(updatedCart);
      } else {
        // Add new item to cart
        setCart([...cart, cartItem]);
      }
      
      setIsAddingToCart(false);
      setCartOpen(true);
      
      toast({
        title: t("added_to_cart"),
        description: `${getLocalizedTitle()} ${t("added_to_cart_success")}`,
      });
    }, 500);
  };
  
  const handleRemoveFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
    
    toast({
      title: t("item_removed"),
      description: t("item_removed_from_cart"),
    });
  };
  
  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCart(updatedCart);
  };
  
  const handleBuyNow = () => {
    // Add current product to cart first
    const cartItem = {
      id: product.id,
      title: getLocalizedTitle(),
      price: product.price,
      quantity: quantity,
      image: product.images[0]
    };
    
    // Add to cart if not already there
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex === -1) {
      setCart([...cart, cartItem]);
    } else {
      // Update quantity if already in cart
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    }
    
    toast({
      title: t("proceeding_to_checkout"),
      description: t("preparing_order"),
    });
    
    // Navigate to checkout
    navigate("/checkout");
  };
  
  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };
  
  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const increaseQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleOpenReview = () => {
    setReviewOpen(true);
  };

  const handleSubmitReview = () => {
    const newReview = {
      id: reviews.length + 1,
      productId: product.id,
      userName: "You", // In a real app, use the user's name
      rating: rating,
      text: reviewText,
      date: new Date().toISOString().split('T')[0]
    };
    
    setReviews([...reviews, newReview]);
    
    toast({
      title: t("review"),
      description: "Thank you for your review!",
    });
    
    setReviewOpen(false);
    setReviewText("");
  };
  
  // Format price to Indian Rupees
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price);

  // Get the correct translations for product title based on language
  const getLocalizedTitle = () => {
    return language === "en" ? product.title_en : product.title_hi;
  };

  const getLocalizedFeatures = () => {
    return language === "en" ? product.features_en : product.features_hi;
  };

  const getLocalizedDescription = () => {
    return language === "en" ? product.description_en : product.description_hi;
  };
  
  // Filter reviews for this product
  const productReviews = reviews.filter(review => review.productId === product.id);
  const displayReviews = showAllReviews ? productReviews : productReviews.slice(0, 2);

  return (
    <MobileLayout>
      <div className="pb-28">
        <div className="bg-white">
          <div className="p-4 flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate("/products")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("back_to_products")}
            </Button>
            
            <Button 
              variant="outline" 
              className="relative" 
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalCartItems()}
                </span>
              )}
            </Button>
          </div>
          
          {/* Product Image */}
          <div className="h-60 bg-gray-100 flex items-center justify-center">
            <img
              src={product.images[0]}
              alt={getLocalizedTitle()}
              className="max-h-60 object-contain"
            />
          </div>
          
          {/* Product Info */}
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold">{getLocalizedTitle()}</h1>
              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                {t(product.category.toLowerCase())}
              </span>
            </div>
            
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 text-sm font-medium">{product.rating}</span>
              </div>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-sm text-muted-foreground">{product.reviews} {t("reviews")}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 text-xs text-primary"
                onClick={handleOpenReview}
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                {t("write_review")}
              </Button>
            </div>
            
            <div className="mt-4">
              <h2 className="text-2xl font-bold text-primary">{formattedPrice}</h2>
              <p className="text-sm text-green-600 mt-1">
                <Check className="h-4 w-4 inline mr-1" />
                {product.inStock ? t("in_stock") : t("out_of_stock")}
              </p>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium">{t("description")}</h3>
              <p className="text-sm text-muted-foreground mt-1">{getLocalizedDescription()}</p>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium">{t("features")}</h3>
              <ul className="mt-2 space-y-1">
                {getLocalizedFeatures().map((feature, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start">
                    <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Reviews Section */}
            <div className="mt-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{t("reviews")}</h3>
                {productReviews.length > 2 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="text-xs"
                  >
                    {showAllReviews ? "Show Less" : "Show All"}
                  </Button>
                )}
              </div>
              
              {displayReviews.length > 0 ? (
                <div className="mt-2 space-y-3">
                  {displayReviews.map((review) => (
                    <Card key={review.id} className="p-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{review.userName}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${
                                i < review.rating 
                                  ? "text-yellow-400 fill-yellow-400" 
                                  : "text-gray-300"
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{review.date}</p>
                      <p className="text-sm mt-2">{review.text}</p>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">No reviews yet. Be the first to review!</p>
              )}
            </div>
            
            <div className="mt-6 flex items-center">
              <span className="mr-4 font-medium">{t("quantity")}:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-2"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-2"
                  onClick={increaseQuantity}
                  disabled={quantity >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fixed bottom actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t flex gap-3 max-w-md mx-auto">
          <Button
            variant="outline"
            className="flex-1 border-primary text-primary"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <span className="animate-pulse">Adding...</span>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                {t("add_to_cart")}
              </>
            )}
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-dhayan-teal-dark text-white"
            onClick={handleBuyNow}
          >
            {t("buy_now")}
          </Button>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("write_review")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1 block">{t("rating")}</label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t("your_review")}</label>
              <Textarea
                placeholder={language === "en" ? "Share your experience with this product..." : "इस उत्पाद के साथ अपने अनुभव को साझा करें..."}
                className="resize-none"
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewOpen(false)}>
              {t("close")}
            </Button>
            <Button onClick={handleSubmitReview}>
              {t("submit_review")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0
                          }).format(item.price)}
                        </p>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-500 ml-1"
                            onClick={() => handleRemoveFromCart(item.id)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">{t("total")}</span>
                  <span className="font-bold text-primary">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0
                    }).format(calculateCartTotal())}
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

export default ProductDetail;

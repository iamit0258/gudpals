import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft, Star, Plus, Minus, Check, MessageSquare, Trash, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556656793-02715d8dd6f8?q=80&w=300&auto=format&fit=crop"
    ],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Silver", value: "#C0C0C0" },
      { name: "Gold", value: "#FFD700" }
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
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?q=80&w=300&auto=format&fit=crop"
    ],
    colors: [
      { name: "Blue", value: "#4169E1" },
      { name: "Purple", value: "#800080" },
      { name: "Green", value: "#1a671aff" }
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
    colors: [
      { name: "Grey", value: "#808080" },
      { name: "Red", value: "#FF0000" }
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
  const { id } = useParams();
  const productId = id;
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
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // In a real app, you would fetch this data
  const product = mockProducts[productId as keyof typeof mockProducts];

  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0].name);
    }
  }, [product]);

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

  // Save cart to localStorage whenever it changes (throttled by requestAnimationFrame)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      localStorage.setItem('cart', JSON.stringify(cart));
    });
    return () => cancelAnimationFrame(id);
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
        image: product.images[0],
        color: selectedColor
      };

      // Check if the product is already in the cart
      const existingItemIndex = cart.findIndex(item => item.id === product.id && item.color === selectedColor);

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

  const handleRemoveFromCart = (id: number, color?: string) => {
    setCart(cart.filter(item => !(item.id === id && item.color === color)));

    toast({
      title: t("item_removed"),
      description: t("item_removed_from_cart"),
    });
  };

  const handleUpdateQuantity = (id: number, newQuantity: number, color?: string) => {
    if (newQuantity < 1) return;

    const updatedCart = cart.map(item =>
      (item.id === id && item.color === color) ? { ...item, quantity: newQuantity } : item
    );

    setCart(updatedCart);
  };

  const handleBuyNow = () => {
    // Add current product to cart first and persist immediately
    const cartItem = {
      id: product.id,
      title: getLocalizedTitle(),
      price: product.price,
      quantity: quantity,
      image: product.images[0],
      color: selectedColor
    };

    const existingItemIndex = cart.findIndex(item => item.id === product.id && item.color === selectedColor);
    let nextCart = [] as any[];

    if (existingItemIndex === -1) {
      nextCart = [...cart, cartItem];
    } else {
      nextCart = [...cart];
      nextCart[existingItemIndex] = {
        ...nextCart[existingItemIndex],
        quantity: nextCart[existingItemIndex].quantity + quantity,
      };
    }

    setCart(nextCart);
    // Persist to localStorage before navigation to avoid race conditions
    localStorage.setItem('cart', JSON.stringify(nextCart));

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

  // Get related products (excluding current product)
  const relatedProducts = Object.values(mockProducts).filter(p => p.id !== product.id);

  return (
    <MobileLayout>
      <div className="pb-28">
        <div className="bg-white">
          <div className="p-4 flex justify-between items-center sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
            <Button variant="ghost" onClick={() => navigate("/products")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("back_to_products")}
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
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
          </div>

          {/* Product Image Gallery */}
          <div className="bg-gray-50 py-4">
            <Carousel className="w-full max-w-xs mx-auto">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <div className="flex aspect-square items-center justify-center p-2">
                        <img
                          src={image}
                          alt={`${getLocalizedTitle()} - View ${index + 1}`}
                          className="max-h-64 w-full object-contain mix-blend-multiply"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
            <div className="flex justify-center gap-1 mt-2">
              {product.images.map((_, index) => (
                <div key={index} className="w-2 h-2 rounded-full bg-gray-300" />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-6">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-900">{getLocalizedTitle()}</h1>
                <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
                  {t(product.category.toLowerCase())}
                </span>
              </div>

              <div className="flex items-center mt-2 gap-4">
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-sm font-bold text-yellow-700">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground underline decoration-dotted">{product.reviews} {t("reviews")}</span>
              </div>

              <div className="mt-4">
                <h2 className="text-3xl font-bold text-primary">{formattedPrice}</h2>
                <p className="text-sm text-green-600 mt-1 font-medium flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  {product.inStock ? t("in_stock") : t("out_of_stock")}
                </p>
              </div>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Select Color: <span className="text-muted-foreground font-normal">{selectedColor}</span></h3>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${selectedColor === color.name ? "border-primary ring-2 ring-primary/20 ring-offset-2" : "border-transparent"
                        }`}
                      style={{ backgroundColor: color.value }}
                      aria-label={`Select ${color.name}`}
                    >
                      {selectedColor === color.name && (
                        <Check className={`h-5 w-5 ${['White', 'Silver', 'Yellow'].includes(color.name) ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-medium mb-2">{t("description")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{getLocalizedDescription()}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">{t("features")}</h3>
              <ul className="space-y-2">
                {getLocalizedFeatures().map((feature, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start bg-gray-50 p-2 rounded-lg">
                    <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="font-medium">{t("quantity")}:</span>
              <div className="flex items-center bg-white border rounded-md shadow-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-gray-100"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-gray-100"
                  onClick={increaseQuantity}
                  disabled={quantity >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="pt-6 border-t">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">{t("reviews")} ({productReviews.length})</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenReview}
                  className="text-xs"
                >
                  <MessageSquare className="h-3 w-3 mr-2" />
                  {t("write_review")}
                </Button>
              </div>

              {displayReviews.length > 0 ? (
                <div className="space-y-4">
                  {displayReviews.map((review) => (
                    <Card key={review.id} className="overflow-hidden border-none shadow-sm bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                              {review.userName.charAt(0)}
                            </div>
                            <div>
                              <span className="font-medium text-sm block">{review.userName}</span>
                              <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{review.text}</p>
                      </CardContent>
                    </Card>
                  ))}

                  {productReviews.length > 2 && (
                    <Button
                      variant="ghost"
                      className="w-full text-primary text-sm"
                      onClick={() => setShowAllReviews(!showAllReviews)}
                    >
                      {showAllReviews ? "Show Less Reviews" : `View All ${productReviews.length} Reviews`}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <MessageSquare className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>

            {/* Related Products */}
            <div className="pt-6 border-t">
              <h3 className="font-bold text-lg mb-4">You Might Also Like</h3>
              <div className="grid grid-cols-2 gap-4">
                {relatedProducts.map((relatedProduct) => (
                  <Card
                    key={relatedProduct.id}
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      navigate(`/products/${relatedProduct.id}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <div className="aspect-square bg-gray-100 p-4 flex items-center justify-center">
                      <img
                        src={relatedProduct.images[0]}
                        alt={language === "en" ? relatedProduct.title_en : relatedProduct.title_hi}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm line-clamp-2 h-10">
                        {language === "en" ? relatedProduct.title_en : relatedProduct.title_hi}
                      </h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-primary">
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0
                          }).format(relatedProduct.price)}
                        </span>
                        <div className="flex items-center text-xs text-yellow-600">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          {relatedProduct.rating}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed bottom actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t flex gap-3 max-w-md mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
          <Button
            variant="outline"
            className="flex-1 border-primary text-primary hover:bg-primary/5"
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
            className="flex-1 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
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
              <label className="text-sm font-medium mb-2 block">{t("rating")}</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{t("your_review")}</label>
              <Textarea
                placeholder={language === "en" ? "Share your experience with this product..." : "इस उत्पाद के साथ अपने अनुभव को साझा करें..."}
                className="resize-none min-h-[120px]"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewOpen(false)}>
              {t("close")}
            </Button>
            <Button onClick={handleSubmitReview} disabled={!reviewText.trim()}>
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

          <div className="py-4 max-h-[60vh] overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="font-medium text-lg text-gray-900">Your cart is empty</h3>
                <p className="text-muted-foreground mt-1 mb-6">{t("cart_empty")}</p>
                <Button onClick={() => setCartOpen(false)}>{t("continue_shopping")}</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={`${item.id}-${item.color || 'default'}`} className="flex items-start border-b pb-4 last:border-0">
                    <div className="h-20 w-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover mix-blend-multiply"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 -mr-2"
                          onClick={() => handleRemoveFromCart(item.id, item.color)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      {item.color && (
                        <p className="text-xs text-muted-foreground mt-1">Color: {item.color}</p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <p className="font-bold text-primary">
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0
                          }).format(item.price)}
                        </p>
                        <div className="flex items-center border rounded-md bg-gray-50">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-white rounded-l-md"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.color)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-white rounded-r-md"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.color)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0
                      }).format(calculateCartTotal())}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold border-t pt-2 mt-2">
                    <span>{t("total")}</span>
                    <span className="text-primary">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0
                      }).format(calculateCartTotal())}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <DialogFooter className="flex gap-2 sm:justify-between">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCartOpen(false)}
              >
                {t("continue_shopping")}
              </Button>
              <Button
                className="flex-1 bg-primary shadow-md"
                onClick={() => {
                  setCartOpen(false);
                  navigate("/checkout");
                }}
              >
                {t("checkout")}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default ProductDetail;


import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft, Star, Plus, Minus, Check, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const mockProducts = {
  "1": {
    id: 1,
    title: "Senior-Friendly Smartphone",
    description: "Our specially designed smartphone features large buttons, simplified interface, and enhanced accessibility features. Perfect for seniors who want to stay connected without the complexity of regular smartphones.",
    price: 5999,
    rating: 4.8,
    reviews: 156,
    features: [
      "Extra large display and buttons",
      "Simplified interface with essential functions",
      "Emergency SOS button",
      "Long-lasting battery",
      "Hearing aid compatibility"
    ],
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=300&auto=format&fit=crop"
    ],
    category: "Electronics",
    inStock: true
  },
  "2": {
    id: 2,
    title: "Meditation Cushion Set",
    description: "Created with seniors in mind, this meditation cushion set provides proper support for longer meditation sessions. The set includes a comfortable seat cushion and a support cushion for your knees.",
    price: 1499,
    rating: 4.5,
    reviews: 89,
    features: [
      "Ergonomic design for comfortable sitting",
      "Made with eco-friendly materials",
      "Easy to clean covers",
      "Provides proper spine alignment",
      "Available in calming colors"
    ],
    images: [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=300&auto=format&fit=crop"
    ],
    category: "Wellness",
    inStock: true
  },
  "3": {
    id: 3,
    title: "Arthritis-Friendly Utensils",
    description: "These specially designed utensils make eating easier for those with arthritis or limited hand mobility. The ergonomic handles provide a comfortable grip while the lightweight design reduces strain.",
    price: 899,
    rating: 4.9,
    reviews: 203,
    features: [
      "Ergonomic grip design",
      "Lightweight construction",
      "Dishwasher safe",
      "BPA-free materials",
      "Set includes knife, fork, spoon, and adaptive handles"
    ],
    images: [
      "https://images.unsplash.com/photo-1630324982388-c15f371bf8c2?q=80&w=300&auto=format&fit=crop"
    ],
    category: "Kitchen",
    inStock: true
  }
};

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  
  // In a real app, you would fetch this data
  const product = mockProducts[productId];
  
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
    toast({
      title: t("added_to_cart"),
      description: `${product.title} ${t("added_to_cart_success")}`,
    });
    
    // In a real app, this would add to cart in database
    setTimeout(() => {
      navigate("/checkout");
    }, 1000);
  };
  
  const handleBuyNow = () => {
    toast({
      title: t("proceeding_to_checkout"),
      description: t("preparing_order"),
    });
    navigate("/checkout");
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

  // Get the correct translations for product title and features based on language
  const getLocalizedTitle = () => {
    if (language === "hi") {
      if (product.id === 1) return "सीनियर-फ्रेंडली स्मार्टफोन";
      if (product.id === 2) return "ध्यान कुशन सेट";
      if (product.id === 3) return "गठिया के अनुकूल बर्तन";
    }
    return product.title;
  };

  const getLocalizedFeatures = () => {
    if (language === "hi") {
      if (product.id === 1) {
        return [
          "अतिरिक्त बड़ा डिस्प्ले और बटन",
          "आवश्यक कार्यों के साथ सरल इंटरफेस",
          "आपातकालीन SOS बटन",
          "लंबे समय तक चलने वाली बैटरी",
          "हियरिंग एड कंपैटिबिलिटी"
        ];
      }
      if (product.id === 2) {
        return [
          "आरामदायक बैठने के लिए एर्गोनोमिक डिज़ाइन",
          "पर्यावरण के अनुकूल सामग्री से बना",
          "आसानी से साफ होने वाले कवर",
          "उचित रीढ़ संरेखण प्रदान करता है",
          "शांत रंगों में उपलब्ध"
        ];
      }
      if (product.id === 3) {
        return [
          "एर्गोनोमिक ग्रिप डिज़ाइन",
          "हल्का निर्माण",
          "डिशवॉशर सेफ",
          "BPA-मुक्त सामग्री",
          "सेट में चाकू, कांटा, चम्मच और अनुकूली हैंडल शामिल हैं"
        ];
      }
    }
    return product.features;
  };

  const getLocalizedDescription = () => {
    if (language === "hi") {
      if (product.id === 1) {
        return "हमारे विशेष रूप से डिज़ाइन किए गए स्मार्टफोन में बड़े बटन, सरल इंटरफेस और बेहतर पहुंच सुविधाएं हैं। उन वरिष्ठ नागरिकों के लिए आदर्श जो नियमित स्मार्टफोन की जटिलता के बिना जुड़े रहना चाहते हैं।";
      }
      if (product.id === 2) {
        return "वरिष्ठ नागरिकों को ध्यान में रखकर बनाया गया, यह ध्यान कुशन सेट लंबे ध्यान सत्रों के लिए उचित समर्थन प्रदान करता है। सेट में एक आरामदायक सीट कुशन और आपके घुटनों के लिए एक सहायक कुशन शामिल है।";
      }
      if (product.id === 3) {
        return "ये विशेष रूप से डिज़ाइन किए गए बर्तन गठिया या सीमित हाथ की गतिशीलता वाले लोगों के लिए खाना आसान बनाते हैं। एर्गोनोमिक हैंडल आरामदायक पकड़ प्रदान करते हैं जबकि हल्के डिज़ाइन तनाव को कम करता है।";
      }
    }
    return product.description;
  };

  return (
    <MobileLayout>
      <div className="pb-20">
        <div className="bg-white">
          <div className="p-4">
            <Button variant="ghost" onClick={() => navigate("/products")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("back_to_products")}
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
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-primary text-primary"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {t("add_to_cart")}
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
    </MobileLayout>
  );
};

export default ProductDetail;


import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Users, Clock, Filter, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";
import { useLanguage } from "@/context/language/LanguageContext";

const Products = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { registerForActivity } = useAuth();
  const { t, language } = useLanguage();
  
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
      price: "₹5,999"
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
      price: "₹1,499"
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
      price: "₹899"
    },
  ];

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-dhayan-purple-dark">{t("senior_products")}</h1>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            {t("filter")}
          </Button>
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
                  {product.price}
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
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white"
                  onClick={() => handleViewProduct(product.id)}
                >
                  <Package className="h-4 w-4 mr-2" />
                  {t("view_product")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Products;


import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";

const Games = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { registerForActivity } = useAuth();
  
  React.useEffect(() => {
    if (location.state?.registered && location.state?.activityName) {
      toast({
        title: "Product Added",
        description: `${location.state.activityName} added to cart`,
      });
      
      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, navigate]);
  
  const products = [
    {
      id: 1,
      title: "Senior-Friendly Smartphone",
      description: "Easy-to-use smartphone with large buttons and simplified interface.",
      price: "₹7,999",
      availability: "In Stock",
      image: "https://images.unsplash.com/photo-1601784551062-20c13f969c4c?q=80&w=300&auto=format&fit=crop",
      category: "Electronics",
    },
    {
      id: 2,
      title: "Medication Organizer",
      description: "Weekly pill organizer with alarms and reminders.",
      price: "₹1,299",
      availability: "In Stock",
      image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=300&auto=format&fit=crop",
      category: "Health",
    },
    {
      id: 3,
      title: "Walking Aid",
      description: "Adjustable walking stick with ergonomic grip.",
      price: "₹899",
      availability: "Limited Stock",
      image: "https://images.unsplash.com/photo-1628815113969-0509784aeede?q=80&w=300&auto=format&fit=crop",
      category: "Mobility",
    },
  ];

  const handleAddToCart = (product: any) => {
    registerForActivity(
      "product",
      product.title,
      "/games"
    );
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-gudpals-green-dark">Senior-Friendly Products</h1>
        
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-32">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-gudpals-green text-white text-xs px-2 py-1 rounded-full">
                  {product.category}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{product.title}</h3>
                <p className="text-sm text-gudpals-gray mt-1">{product.description}</p>
                
                <div className="flex items-center mt-3 text-xs text-gudpals-gray-dark">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span className="mr-3">Price: {product.price}</span>
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{product.availability}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full bg-gudpals-green hover:bg-gudpals-green-dark text-white"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Games;

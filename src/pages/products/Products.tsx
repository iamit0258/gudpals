
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";

const Products = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { registerForActivity } = useAuth();
  
  React.useEffect(() => {
    if (location.state?.registered && location.state?.activityName) {
      toast({
        title: "Purchase Successful",
        description: `You've successfully ordered ${location.state.activityName}`,
      });
      
      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, navigate]);
  
  const products = [
    {
      id: 1,
      title: "Senior-Friendly Smartphone",
      description: "Large buttons and simple interface for easier navigation.",
      users: 156,
      availability: "In Stock",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=300&auto=format&fit=crop",
      category: "Electronics",
    },
    {
      id: 2,
      title: "Meditation Cushion Set",
      description: "Comfortable cushions for your daily meditation practice.",
      users: 89,
      availability: "Limited Stock",
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=300&auto=format&fit=crop",
      category: "Wellness",
    },
    {
      id: 3,
      title: "Arthritis-Friendly Utensils",
      description: "Specially designed for better grip and comfort.",
      users: 203,
      availability: "In Stock",
      image: "https://images.unsplash.com/photo-1630324982388-c15f371bf8c2?q=80&w=300&auto=format&fit=crop",
      category: "Kitchen",
    },
  ];

  const handleProductPurchase = (product: any) => {
    registerForActivity(
      "product",
      product.title,
      "/products"
    );
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-dhayan-purple-dark">Products for Seniors</h1>
        
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-32">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-dhayan-purple text-white text-xs px-2 py-1 rounded-full">
                  {product.category}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{product.title}</h3>
                <p className="text-sm text-dhayan-gray mt-1">{product.description}</p>
                
                <div className="flex items-center mt-3 text-xs text-dhayan-gray-dark">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span className="mr-3">{product.users} users</span>
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{product.availability}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white"
                  onClick={() => handleProductPurchase(product)}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Purchase Now
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

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft, Star, Plus, Minus, Check, MessageSquare, Trash, ChevronLeft, ChevronRight, Share2, Pencil } from "lucide-react";
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

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/ClerkAuthBridge";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<any>(null);
  const { user } = useAuth();

  // Fetch product data from Supabase
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Fetch main product
        const { data: pData, error: pError } = await supabase
          .from('products')
          .select('*')
          .eq('id', parseInt(id))
          .single();

        if (pError) throw pError;
        setProduct(pData);

        // Fetch related products (same category or random)
        const { data: rData } = await supabase
          .from('products')
          .select('*')
          .neq('id', parseInt(id))
          .limit(2);

        setRelatedProducts(rData || []);

        // Fetch reviews
        const { data: revData } = await supabase
          .from('product_reviews')
          .select('*')
          .eq('product_id', parseInt(id));

        setReviews(revData || []);

      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: "Could not load product details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, toast]);

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-dhayan-gray">Loading product details...</p>
        </div>
      </MobileLayout>
    );
  }

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

    setTimeout(() => {
      const cartItem = {
        id: product.id,
        title: getLocalizedTitle(),
        price: product.price,
        quantity: quantity,
        image: product.image_url,
        color: selectedColor
      };

      const existingItemIndex = cart.findIndex(item => item.id === product.id && item.color === selectedColor);

      if (existingItemIndex >= 0) {
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += quantity;
        setCart(updatedCart);
      } else {
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
    const cartItem = {
      id: product.id,
      title: getLocalizedTitle(),
      price: product.price,
      quantity: quantity,
      image: product.image_url,
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
    localStorage.setItem('cart', JSON.stringify(nextCart));

    toast({
      title: t("proceeding_to_checkout"),
      description: t("preparing_order"),
    });

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

  const handleSubmitReview = async () => {
    try {
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please login to submit a review.",
          variant: "destructive"
        });
        navigate("/login", { state: { from: `/products/${product.id}` } });
        return;
      }

      const newReview = {
        product_id: product.id,
        user_id: user.uid,
        user_name: user.displayName || 'Anonymous',
        rating: rating,
        comment: reviewText,
      };

      const { error } = await supabase
        .from('product_reviews')
        .insert(newReview);

      if (error) throw error;

      toast({
        title: t("review"),
        description: "Thank you for your review!",
      });

      setReviews([...reviews, { ...newReview, id: Date.now(), created_at: new Date().toISOString() }]);
      setReviewOpen(false);
      setRating(5);
      setReviewText("");
      setEditingReview(null);

    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review. You may only submit one review per product.",
        variant: "destructive"
      });
    }
  };

  const handleEditReview = (review: any) => {
    setEditingReview(review);
    setRating(review.rating);
    setReviewText(review.comment);
    setReviewOpen(true);
  };

  const handleUpdateReview = async () => {
    if (!editingReview) return;
    try {
      const { error } = await supabase
        .from('product_reviews')
        .update({ rating, comment: reviewText })
        .eq('id', editingReview.id);

      if (error) throw error;

      toast({ title: "Review Updated", description: "Your review has been updated." });
      setReviews(reviews.map(r => r.id === editingReview.id ? { ...r, rating, comment: reviewText } : r));
      setReviewOpen(false);
      setRating(5);
      setReviewText("");
      setEditingReview(null);
    } catch (error) {
      console.error("Error updating review:", error);
      toast({ title: "Error", description: "Failed to update review.", variant: "destructive" });
    }
  };

  const handleDeleteReview = async (reviewId: any) => {
    try {
      const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast({ title: "Review Deleted", description: "Your review has been removed." });
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({ title: "Error", description: "Failed to delete review.", variant: "destructive" });
    }
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price);

  const getLocalizedTitle = () => {
    return language === "hi" && product.name_hi ? product.name_hi : product.name;
  };

  const getLocalizedDescription = () => {
    return language === "hi" && product.description_hi ? product.description_hi : product.description;
  };

  const displayReviews = showAllReviews ? reviews : reviews.slice(0, 2);

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

          <div className="bg-gray-50 py-4 flex items-center justify-center min-h-[300px]">
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={getLocalizedTitle()}
              className="max-h-64 object-contain mix-blend-multiply"
            />
          </div>

          <div className="p-4 space-y-6">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-900">{getLocalizedTitle()}</h1>
                <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
                  {t(product.category?.toLowerCase() || "general")}
                </span>
              </div>

              <div className="flex items-center mt-2 gap-4">
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-sm font-bold text-yellow-700">{product.rating || "5.0"}</span>
                </div>
                {reviews.length > 0 && (
                  <span className="text-sm text-muted-foreground underline decoration-dotted">{reviews.length} {t("reviews")}</span>
                )}
              </div>

              <div className="mt-4">
                <h2 className="text-3xl font-bold text-primary">{formattedPrice}</h2>
                <p className="text-sm text-green-600 mt-1 font-medium flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  {product.stock_quantity > 0 ? t("in_stock") : t("out_of_stock")}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">{t("description")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{getLocalizedDescription()}</p>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="font-medium">{t("quantity")}:</span>
              <div className="flex items-center bg-white border rounded-md shadow-sm">
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-gray-100" onClick={decreaseQuantity} disabled={quantity <= 1}><Minus className="h-4 w-4" /></Button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-gray-100" onClick={increaseQuantity} disabled={quantity >= 10}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>

            <div className="pt-6 border-t">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">{t("reviews")} ({reviews.length})</h3>
                <Button variant="outline" size="sm" onClick={handleOpenReview} className="text-xs">
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
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">{(review.user_name || 'U').charAt(0).toUpperCase()}</div>
                            <div>
                              <span className="font-medium text-sm block">{review.user_name || 'User'}</span>
                              <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{review.comment}</p>
                        {user && review.user_id === user.uid && (
                          <div className="flex gap-2 mt-2 pt-2 border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 text-blue-600 hover:bg-blue-50"
                              onClick={() => handleEditReview(review)}
                            >
                              <Pencil className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteReview(review.id)}
                            >
                              <Trash className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <MessageSquare className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No reviews yet.</p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t">
              <h3 className="font-bold text-lg mb-4">You Might Also Like</h3>
              <div className="grid grid-cols-2 gap-4">
                {relatedProducts.map((rp) => (
                  <Card key={rp.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => { navigate(`/products/${rp.id}`); window.scrollTo(0, 0); }}>
                    <div className="aspect-square bg-gray-100 p-4 flex items-center justify-center">
                      <img src={rp.image_url || "/placeholder.svg"} alt={rp.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm line-clamp-2 h-10">{language === "hi" && rp.name_hi ? rp.name_hi : rp.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-primary">₹{rp.price}</span>
                        <div className="flex items-center text-xs text-yellow-600"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />4.5</div>
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
            <Button variant="outline" onClick={() => { setReviewOpen(false); setEditingReview(null); setRating(5); setReviewText(""); }}>
              {t("close")}
            </Button>
            <Button onClick={editingReview ? handleUpdateReview : handleSubmitReview} disabled={!reviewText.trim()}>
              {editingReview ? "Update Review" : t("submit_review")}
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

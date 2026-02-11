
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Users, Clock, Filter, Star, ShoppingCart, Trash2, Search, X, Check, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";
import { useLanguage } from "@/context/language/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

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

    // Save cart to localStorage whenever it changes (throttled)
    React.useEffect(() => {
        const id = requestAnimationFrame(() => {
            localStorage.setItem('cart', JSON.stringify(cart));
        });
        return () => cancelAnimationFrame(id);
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

    const [products, setProducts] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
    const [priceRange, setPriceRange] = React.useState({ min: "", max: "" });
    const [minRating, setMinRating] = React.useState<string>("all");
    const [showFilters, setShowFilters] = React.useState(false);

    // Derived values
    const categories = React.useMemo(() => {
        const cats = new Set(products.map(p => p.category).filter(Boolean));
        return ["all", ...Array.from(cats)];
    }, [products]);

    const filteredProducts = React.useMemo(() => {
        return products.filter(product => {
            // Search filter
            const searchLower = searchQuery.toLowerCase();
            const name = (language === "hi" && product.name_hi ? product.name_hi : product.name).toLowerCase();
            const desc = (language === "hi" && product.description_hi ? product.description_hi : product.description).toLowerCase();
            const matchesSearch = name.includes(searchLower) || desc.includes(searchLower);

            // Category filter
            const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;

            // Price filter
            const price = product.price || 0;
            const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
            const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
            const matchesPrice = price >= minPrice && price <= maxPrice;

            // Rating filter
            const rating = product.rating || 0;
            const minRatingVal = minRating === "all" ? 0 : parseFloat(minRating);
            const matchesRating = rating >= minRatingVal;

            return matchesSearch && matchesCategory && matchesPrice && matchesRating;
        });
    }, [products, searchQuery, selectedCategory, priceRange, minRating, language]);

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setPriceRange({ min: "", max: "" });
        setMinRating("all");
        toast({ title: t("filters_cleared"), description: t("showing_all_products") });
    };

    // Fetch products from Supabase
    React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_active', true);

                if (error) throw error;
                setProducts(data || []);
            } catch (error) {
                console.error("Error fetching products:", error);
                toast({
                    title: "Error",
                    description: "Failed to load products. Using offline data.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [toast]);

    const handleViewProduct = (productId) => {
        navigate(`/products/${productId}`);
    };

    const handleAddToCart = (product) => {
        const productTitle = language === "hi" && product.name_hi ? product.name_hi : product.name;
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
                title: productTitle,
                price: product.price,
                image: product.image_url,
                quantity: 1
            }]);
        }

        toast({
            title: t("added_to_cart"),
            description: `${productTitle} ${t("added_to_cart_success")}`,
        });
    };

    const handleBuyNow = (product) => {
        const productTitle = language === "hi" && product.name_hi ? product.name_hi : product.name;
        // Compute updated cart and persist immediately
        const existingItem = cart.find(item => item.id === product.id);
        let updatedCart;
        if (existingItem) {
            updatedCart = cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            updatedCart = [...cart, {
                id: product.id,
                title: productTitle,
                price: product.price,
                image: product.image_url,
                quantity: 1
            }];
        }
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
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

                    </div>
                </div>

                <div className="space-y-4">
                    {/* Search and Filter Bar */}
                    {/* Enhanced Search and Filter Section */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4 sticky top-0 z-10 mx-[-1rem] sm:mx-0">
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    placeholder={t("search_products")}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-12 text-base shadow-sm border-gray-200 focus:border-primary focus:ring-primary/20 transition-all rounded-lg"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <Button
                                variant={showFilters ? "secondary" : "outline"}
                                onClick={() => setShowFilters(!showFilters)}
                                className={`h-12 px-4 border-gray-200 shadow-sm transition-colors ${showFilters ? 'bg-primary/10 text-primary border-primary/20' : 'hover:bg-gray-50'}`}
                            >
                                <Filter className="h-5 w-5 mr-2" />
                                {t("filter")}
                                {(priceRange.min || priceRange.max || minRating !== 'all') && (
                                    <span className="ml-1.5 flex h-2 w-2 rounded-full bg-primary" />
                                )}
                            </Button>
                        </div>

                        {/* Horizontal Scrolling Categories */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-2 px-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`
                                        flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border
                                        ${selectedCategory === cat
                                            ? 'bg-primary text-white border-primary shadow-md transform scale-105'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                                    `}
                                >
                                    {cat === 'all' ? t("all_categories") : cat}
                                </button>
                            ))}
                        </div>

                        {/* Collapsible Advanced Filters */}
                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t("price_range")}</label>
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                            <Input
                                                type="number"
                                                placeholder="Min"
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                                className="pl-7"
                                            />
                                        </div>
                                        <span className="text-gray-400">-</span>
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                            <Input
                                                type="number"
                                                placeholder="Max"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                                className="pl-7"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t("rating")}</label>
                                    <Select value={minRating} onValueChange={setMinRating}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={t("any_rating")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t("any_rating")}</SelectItem>
                                            <SelectItem value="4">4+ Stars</SelectItem>
                                            <SelectItem value="3">3+ Stars</SelectItem>
                                            <SelectItem value="2">2+ Stars</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-end">
                                    <Button
                                        variant="destructive"
                                        size="default"
                                        onClick={clearFilters}
                                        className="w-full bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 shadow-none"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        {t("clear_filters")}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-dhayan-gray">Loading products...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-20 text-dhayan-gray">
                            <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No products match your search.</p>
                            <Button variant="link" onClick={clearFilters} className="mt-2 text-primary">
                                {t("clear_filters")}
                            </Button>
                        </div>
                    ) : (
                        filteredProducts.map((product) => (
                            <Card
                                key={product.id}
                                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => handleViewProduct(product.id)}
                            >
                                <div className="relative h-32">
                                    <img
                                        src={product.image_url || "/placeholder.svg"}
                                        alt={language === "hi" && product.name_hi ? product.name_hi : product.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2 bg-dhayan-purple text-white text-xs px-2 py-1 rounded-full">
                                        {product.category || t("general")}
                                    </div>
                                    <div className="absolute bottom-2 left-2 bg-white/70 backdrop-blur-sm font-bold text-primary px-2 py-1 rounded-lg">
                                        {formatPrice(product.price)}
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-lg">
                                        {language === "hi" && product.name_hi ? product.name_hi : product.name}
                                    </h3>
                                    <p className="text-sm text-dhayan-gray mt-1 line-clamp-2">
                                        {language === "hi" && product.description_hi ? product.description_hi : product.description}
                                    </p>

                                    <div className="flex items-center mt-3 text-xs text-dhayan-gray-dark">
                                        <Clock className="h-3.5 w-3.5 mr-1" />
                                        <span className="mr-3">{product.stock_quantity > 0 ? t("in_stock") : t("out_of_stock")}</span>
                                        <Star className="h-3.5 w-3.5 mr-1 text-amber-500" />
                                        <span>{product.rating || "5.0"}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
                                    <Button
                                        variant="secondary"
                                        className="w-full border-primary text-primary flex items-center justify-center"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(product);
                                        }}
                                    >
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        {t("add_to_cart")}
                                    </Button>
                                    <Button
                                        className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white flex items-center justify-center"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleBuyNow(product);
                                        }}
                                    >
                                        <Package className="h-4 w-4 mr-2" />
                                        {t("buy_now")}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Cart Dialog */}
            <Dialog open={cartOpen} onOpenChange={setCartOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t("your_cart") || "Your Cart"}</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 space-y-4">
                                <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                    <ShoppingCart className="h-10 w-10 text-gray-400" />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="font-medium text-lg text-gray-900">{t("cart_empty")}</p>
                                    <p className="text-sm text-gray-500">Add products to your cart to see them here.</p>
                                </div>
                                <Button
                                    className="mt-4 bg-primary hover:bg-primary/90 min-w-[140px]"
                                    onClick={() => setCartOpen(false)}
                                >
                                    Start Shopping
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="max-h-[60vh] overflow-y-auto pr-1">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-center gap-4 py-3 border-b last:border-0 border-gray-100">
                                            <div className="h-16 w-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-sm text-gray-900 truncate">{item.title}</h4>
                                                <div className="flex justify-between items-center mt-1">
                                                    <p className="font-semibold text-primary text-sm">
                                                        {formatPrice(item.price)} <span className="text-gray-400 font-normal">x {item.quantity}</span>
                                                    </p>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                                                        onClick={() => handleRemoveFromCart(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center mt-4">
                                    <span className="font-medium text-gray-700">{t("total")}</span>
                                    <span className="font-bold text-xl text-primary">
                                        {formatPrice(calculateCartTotal())}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {cart.length > 0 && (
                        <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto"
                                onClick={() => setCartOpen(false)}
                            >
                                {t("continue_shopping")}
                            </Button>
                            <Button
                                className="w-full sm:w-1/2 bg-primary hover:bg-primary/90 gap-2"
                                onClick={() => {
                                    setCartOpen(false);
                                    navigate("/checkout");
                                }}
                            >
                                {t("checkout")}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>
        </MobileLayout>
    );
};

export default Products;

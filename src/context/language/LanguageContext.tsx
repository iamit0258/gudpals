import React, { createContext, useState, useContext, ReactNode } from "react";

type Language = "en" | "hi";

interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // General
    namaste: "Namaste",
    welcome: "Welcome to GUDPALS",
    dedicated: "Dedicated to enriching the lives of senior citizens",
    complete_profile: "Complete Your Profile",
    help_personalize: "Help us personalize your experience",
    get_started: "Get Started",
    loading: "Loading",
    
    // Home & Navigation
    friends: "Friends",
    profile: "Profile",
    settings: "Settings",
    products: "Products",
    sessions: "Sessions",
    close: "Close",

    // Services
    our_services: "Our Services",
    live_sessions: "Live Sessions",
    join_interactive: "Join interactive group sessions",
    digital_literacy: "Digital Literacy",
    learn_smartphone: "Learn smartphone & internet basics",
    activities: "Activities",
    arts_crafts: "Arts, crafts & hobby sessions",
    employment: "Employment",
    part_time: "Part-time opportunities for seniors",
    travel_plans: "Travel Plans",
    senior_friendly: "Senior-friendly tours & trips",
    
    // Sessions
    upcoming_sessions: "Upcoming Sessions",
    today: "Today",
    tomorrow: "Tomorrow",
    by: "by",
    participants: "participants",
    register: "Register",
    your_sessions: "Your Sessions",
    recommended_for_you: "Recommended For You",
    more_sessions_coming: "More sessions coming soon!",
    registration_successful: "Registration Successful",
    already_registered: "Already Registered",
    registered_for: "You've been registered for",
    already_registered_for: "You're already registered for",
    registration_failed: "Registration Failed",
    registration_error: "Something went wrong. Please try again.",
    no_upcoming_sessions: "No upcoming sessions found.",
    
    // Friends related
    nearby: "Nearby",
    connections: "Connections",
    requests: "Requests",
    location_beacon: "Location Beacon",
    beacon_visible: "You are visible to nearby users",
    beacon_invisible: "You are not visible to nearby users",
    beacon_activated: "Beacon Activated",
    beacon_active_desc: "Now nearby users can see your location",
    beacon_deactivated: "Beacon Deactivated",
    beacon_inactive_desc: "Your location is now hidden from others",
    add_friend: "Add Friend",
    friend_request_sent: "Friend Request Sent",
    friend_request_desc: "They will be notified of your request",
    request_accepted: "Request Accepted",
    friend_added_success: "Friend added successfully",
    request_declined: "Request Declined",
    friend_request_declined: "Friend request declined",
    opening_chat: "Opening Chat",
    chat_with: "Starting chat with",
    calling: "Calling",
    voice_calling: "Voice calling",
    video_calling: "Video calling",
    search_friends: "Search friends",
    no_matches_found: "No matches found",
    active_now: "Active now",
    no_friend_requests: "No friend requests at the moment",
    accept: "Accept",
    decline: "Decline",

    // Products and Shopping
    senior_products: "Products for Seniors",
    filter: "Filter",
    users: "users",
    in_stock: "In Stock",
    limited_stock: "Limited Stock",
    out_of_stock: "Out of Stock",
    view_product: "View Product",
    back_to_products: "Back to Products",
    product_not_found: "Product not found",
    reviews: "reviews",
    review: "Review",
    write_review: "Write a Review",
    submit_review: "Submit Review",
    rating: "Rating",
    your_review: "Your Review",
    features: "Features",
    description: "Description",
    quantity: "Quantity",
    add_to_cart: "Add to Cart",
    buy_now: "Buy Now",
    added_to_cart: "Added to Cart",
    added_to_cart_success: "has been added to your cart",
    proceeding_to_checkout: "Proceeding to Checkout",
    preparing_order: "Preparing your order...",
    electronics: "Electronics",
    wellness: "Wellness",
    kitchen: "Kitchen",
    purchase_successful: "Purchase Successful",
    successfully_ordered: "You've successfully ordered",
    
    // Checkout
    checkout: "Checkout",
    items_in_cart: "Items in Cart",
    cart_empty: "Your cart is empty",
    order_summary: "Order Summary",
    subtotal: "Subtotal",
    delivery_fee: "Delivery Fee",
    total: "Total",
    free: "Free",
    item_removed: "Item Removed",
    item_removed_from_cart: "Item has been removed from your cart",
    payment_method: "Payment Method",
    cash_on_delivery: "Cash on Delivery",
    online_payment: "Online Payment",
    delivery_address: "Delivery Address",
    home: "Home",
    work: "Work",
    full_name: "Full Name",
    phone_number: "Phone Number",
    address: "Address",
    city: "City",
    pincode: "Pincode",
    fast_delivery: "Fast Delivery",
    secure_payment: "Secure Payment",
    easy_returns: "Easy Returns",
    processing: "Processing...",
    place_order: "Place Order",
    order_placed: "Order Placed",
    order_success_message: "Your order has been placed successfully",
    order_successful: "Order Successful!",
    order_confirmation_message: "Thank you for your purchase. Your order will be delivered soon.",
    order_confirmation_email: "We have sent a confirmation to your registered email.",
    continue_shopping: "Continue Shopping",
    go_to_home: "Go to Home",
  },
  hi: {
    // General
    namaste: "नमस्ते",
    welcome: "गुडपाल्स में आपका स्वागत है",
    dedicated: "वरिष्ठ नागरिकों के जीवन को समृद्ध बनाने के लिए समर्पित",
    complete_profile: "अपनी प्रोफाइल पूरी करें",
    help_personalize: "अपने अनुभव को व्यक्तिगत बनाने में हमारी मदद करें",
    get_started: "शुरू करें",
    loading: "लोड हो रहा है",
    
    // Home & Navigation
    friends: "मित्र",
    profile: "प्रोफाइल",
    settings: "सेटिंग्स",
    products: "उत्पाद",
    sessions: "सत्र",
    close: "बंद करें",
    
    // Services
    our_services: "हमारी सेवाएं",
    live_sessions: "लाइव सत्र",
    join_interactive: "इंटरैक्टिव ग्रुप सत्रों में शामिल हों",
    digital_literacy: "डिजिटल साक्षरता",
    learn_smartphone: "स्मार्टफोन और इंटरनेट की मूलबातें सीखें",
    activities: "गतिविधियां",
    arts_crafts: "कला, शिल्प और शौक सत्र",
    employment: "रोजगार",
    part_time: "वरिष्ठ नागरिकों के लिए अंशकालिक अवसर",
    travel_plans: "यात्रा योजनाएं",
    senior_friendly: "वरिष्ठ अनुकूल टूर और यात्राएं",
    
    // Sessions
    upcoming_sessions: "आने वाले सत्र",
    today: "आज",
    tomorrow: "कल",
    by: "द्वारा",
    participants: "प्रतिभागी",
    register: "रजिस्टर करें",
    your_sessions: "आपके सत्र",
    recommended_for_you: "आपके लिए अनुशंसित",
    more_sessions_coming: "जल्द ही और सत्र आ रहे हैं!",
    registration_successful: "पंजीकरण सफल",
    already_registered: "पहले से पंजीकृत",
    registered_for: "आपको इसके लिए पंजीकृत किया गया है",
    already_registered_for: "आप पहले से ही इसके लिए पंजीकृत हैं",
    registration_failed: "पंजीकरण विफल",
    registration_error: "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
    no_upcoming_sessions: "कोई आगामी सत्र नहीं मिला।",
    
    // Friends related
    nearby: "आस-पास",
    connections: "कनेक्शन",
    requests: "अनुरोध",
    location_beacon: "स्थान बीकन",
    beacon_visible: "आप आस-पास के उपयोगकर्ताओं को दिखाई दे रहे हैं",
    beacon_invisible: "आप आस-पास के उपयोगकर्ताओं को दिखाई नहीं दे रहे हैं",
    beacon_activated: "बीकन सक्रिय किया गया",
    beacon_active_desc: "अब आस-पास के उपयोगकर्ता आपका स्थान देख सकते हैं",
    beacon_deactivated: "बीकन निष्क्रिय किया गया",
    beacon_inactive_desc: "आपका स्थान अब दूसरों से छिपा हुआ है",
    add_friend: "मित्र जोड़ें",
    friend_request_sent: "मित्र अनुरोध भेजा गया",
    friend_request_desc: "उन्हें आपके अनुरोध की सूचना दी जाएगी",
    request_accepted: "अनुरोध स्वीकृत",
    friend_added_success: "मित्र सफलतापूर्वक जोड़ा गया",
    request_declined: "अनुरोध अस्वीकृत",
    friend_request_declined: "मित्र अनुरोध अस्वीकृत",
    opening_chat: "चैट खोली जा रही है",
    chat_with: "चैट शुरू की जा रही है",
    calling: "कॉल किया जा रहा है",
    voice_calling: "वॉयस कॉल",
    video_calling: "वीडियो कॉल",
    search_friends: "मित्र खोजें",
    no_matches_found: "कोई मेल नहीं मिला",
    active_now: "अभी सक्रिय",
    no_friend_requests: "फिलहाल कोई मित्र अनुरोध नहीं है",
    accept: "स्वीकार करें",
    decline: "अस्वीकार करें",
    
    // Products and Shopping
    senior_products: "वरिष्ठ नागरिकों के लिए उत्पाद",
    filter: "फ़िल्टर",
    users: "उपयोगकर्ता",
    in_stock: "स्टॉक में है",
    limited_stock: "सीमित स्टॉक",
    out_of_stock: "स्टॉक में नहीं है",
    view_product: "उत्पाद देखें",
    back_to_products: "उत्पादों पर वापस जाएं",
    product_not_found: "उत्पाद नहीं मिला",
    reviews: "समीक्षाएँ",
    review: "समीक्षा",
    write_review: "समीक्षा लिखें",
    submit_review: "समीक्षा जमा करें",
    rating: "रेटिंग",
    your_review: "आपकी समीक्षा",
    features: "विशेषताएं",
    description: "विवरण",
    quantity: "मात्रा",
    add_to_cart: "कार्ट में जोड़ें",
    buy_now: "अभी खरीदें",
    added_to_cart: "कार्ट में जोड़ा गया",
    added_to_cart_success: "आपके कार्ट में जोड़ दिया गया है",
    proceeding_to_checkout: "चेकआउट की ओर बढ़ रहे हैं",
    preparing_order: "आपका ऑर्डर तैयार किया जा रहा है...",
    electronics: "इलेक्ट्रॉनिक्स",
    wellness: "स्वास्थ्य",
    kitchen: "रसोई",
    purchase_successful: "खरीदारी सफल",
    successfully_ordered: "आपने सफलतापूर्वक ऑर्डर किया है",
    
    // Checkout
    checkout: "चेकआउट",
    items_in_cart: "कार्ट में आइटम",
    cart_empty: "आपका कार्ट खाली है",
    order_summary: "ऑर्डर सारांश",
    subtotal: "उप-कुल",
    delivery_fee: "डिलीवरी शुल्क",
    total: "कुल",
    free: "मुफ़्त",
    item_removed: "आइटम हटाया गया",
    item_removed_from_cart: "आइटम आपके कार्ट से हटा दिया गया है",
    payment_method: "भुगतान विधि",
    cash_on_delivery: "डिलीवरी पर नकद भुगतान",
    online_payment: "ऑनलाइन भुगतान",
    delivery_address: "डिलीवरी पता",
    home: "घर",
    work: "कार्यालय",
    full_name: "पूरा नाम",
    phone_number: "फोन नंबर",
    address: "पता",
    city: "शहर",
    pincode: "पिनकोड",
    fast_delivery: "तेज़ डिलीवरी",
    secure_payment: "सुरक्षित भुगतान",
    easy_returns: "आसान वापसी",
    processing: "प्रोसेसिंग...",
    place_order: "ऑर्डर करें",
    order_placed: "ऑर्डर दिया गया",
    order_success_message: "आपका ऑर्डर सफलतापूर्वक दिया गया है",
    order_successful: "ऑर्डर सफल!",
    order_confirmation_message: "आपकी खरीदारी के लिए धन्यवाद। आपका ऑर्डर जल्द ही पहुंचा दिया जाएगा।",
    order_confirmation_email: "हमने आपके पंजीकृत ईमेल पर एक पुष्टिकरण भेजा है।",
    continue_shopping: "शॉपिंग जारी रखें",
    go_to_home: "होम पेज पर जाएं",
  }
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

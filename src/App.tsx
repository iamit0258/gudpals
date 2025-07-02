import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/ClerkAuthBridge";
import { LanguageProvider } from "@/context/language/LanguageContext";
import VoiceAssistantLayout from "@/components/layout/VoiceAssistantLayout";
import Index from "./pages/Index";
import Products from "./pages/products/Products";
import ProductDetail from "./pages/products/ProductDetail";
import Checkout from "./pages/checkout/Checkout";
import PaymentPage from "./pages/payment/PaymentPage";
import Profile from "./pages/profile/Profile";
import Sessions from "./pages/sessions/Sessions";
import Astrology from "./pages/astrology/Astrology";
import AstrologyChat from "./pages/astrology/AstrologyChat";
import AstrologyPayment from "./pages/astrology/AstrologyPayment";
import Activities from "./pages/activities/Activities";
import Events from "./pages/events/Events";
import Friends from "./pages/friends/Friends";
import Learn from "./pages/learn/Learn";
import DigitalLiteracy from "./pages/digitalLiteracy/DigitalLiteracy";
import Games from "./pages/games/Games";
import Travel from "./pages/travel/Travel";
import Employment from "./pages/employment/Employment";
import Settings from "./pages/settings/Settings";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
import ClerkLogin from "./pages/auth/ClerkLogin";
import ClerkRegister from "./pages/auth/ClerkRegister";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <VoiceAssistantLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/astrology" element={<Astrology />} />
                <Route path="/astrology/chat" element={<AstrologyChat />} />
                <Route path="/astrology/payment" element={<AstrologyPayment />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/events" element={<Events />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/digital-literacy" element={<DigitalLiteracy />} />
                <Route path="/games" element={<Games />} />
                <Route path="/travel" element={<Travel />} />
                <Route path="/employment" element={<Employment />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/sign-in" element={<ClerkLogin />} />
                <Route path="/sign-up" element={<ClerkRegister />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </VoiceAssistantLayout>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/ClerkAuthBridge";
import { LanguageProvider } from "@/context/language/LanguageContext";
import VoiceAssistantLayout from "@/components/layout/VoiceAssistantLayout";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { Suspense } from "react";
import { PageLoadingSkeleton } from "@/components/ui/loading-states";
import Index from "./pages/Index";
import Products from "./pages/products/Products";
import ProductDetail from "./pages/products/ProductDetail";
import Checkout from "./pages/checkout/Checkout";
import PaymentPage from "./pages/payment/PaymentPage";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentCanceled from "./pages/payment/PaymentCanceled";
import Profile from "./pages/profile/Profile";
import Sessions from "./pages/sessions/Sessions";
import SessionLive from "./pages/sessions/SessionLive";
import Astrology from "./pages/astrology/Astrology";
import AstrologyChat from "./pages/astrology/AstrologyChat";
import AstrologyPayment from "./pages/astrology/AstrologyPayment";
import Activities from "./pages/activities/Activities";
import Events from "./pages/events/Events";
import Friends from "./pages/friends/Friends";
import ChatList from "./pages/chat/ChatList";
import ChatRoom from "./pages/chat/ChatRoom";
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
import Onboarding from "./pages/auth/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (updated from cacheTime)
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <VoiceAssistantLayout>
                <Suspense fallback={<PageLoadingSkeleton />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/payment-canceled" element={<PaymentCanceled />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/sessions" element={<Sessions />} />
                    <Route path="/sessions/:id/live" element={<SessionLive />} />
                    <Route path="/astrology" element={<Astrology />} />
                    <Route path="/astrology/chat" element={<AstrologyChat />} />
                    <Route path="/astrology/payment" element={<AstrologyPayment />} />
                    <Route path="/activities" element={<Activities />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/chat" element={<ChatList />} />
                    <Route path="/chat/:userId" element={<ChatRoom />} />
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
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </VoiceAssistantLayout>
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

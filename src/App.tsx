
import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { AuthProvider, useAuth } from "@/context/ClerkAuthBridge";
import { LanguageProvider } from "@/context/language/LanguageContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ClerkLogin from "./pages/auth/ClerkLogin";
import ClerkRegister from "./pages/auth/ClerkRegister";
import Profile from "./pages/profile/Profile";
import Friends from "./pages/friends/Friends";
import Products from "./pages/products/Products";
import ProductDetail from "./pages/products/ProductDetail";
import Checkout from "./pages/checkout/Checkout";
import Sessions from "./pages/sessions/Sessions";
import DigitalLiteracy from "./pages/digitalLiteracy/DigitalLiteracy";
import Activities from "./pages/activities/Activities";
import Employment from "./pages/employment/Employment";
import Travel from "./pages/travel/Travel";
import Settings from "./pages/settings/Settings";
import Games from "./pages/games/Games";
import Events from "./pages/events/Events";
import Astrology from "./pages/astrology/Astrology";
import AstrologyChat from "./pages/astrology/AstrologyChat";
import AstrologyPayment from "./pages/astrology/AstrologyPayment";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  );
};

// Create the app content component
const AppContent = () => {
  return (
    <>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/sign-in" element={<ClerkLogin />} />
        <Route path="/sign-up" element={<ClerkRegister />} />
        
        {/* Protected routes */}
        <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/products/:productId" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/digitalLiteracy" element={<ProtectedRoute><DigitalLiteracy /></ProtectedRoute>} />
        <Route path="/activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
        <Route path="/employment" element={<ProtectedRoute><Employment /></ProtectedRoute>} />
        <Route path="/travel" element={<ProtectedRoute><Travel /></ProtectedRoute>} />
        <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/astrology" element={<ProtectedRoute><Astrology /></ProtectedRoute>} />
        <Route path="/astrology/chat" element={<ProtectedRoute><AstrologyChat /></ProtectedRoute>} />
        <Route path="/astrology/payment" element={<ProtectedRoute><AstrologyPayment /></ProtectedRoute>} />
        
        {/* Legacy routes for compatibility */}
        <Route path="/login" element={<Navigate to="/sign-in" replace />} />
        <Route path="/register" element={<Navigate to="/sign-up" replace />} />
        <Route path="/verify" element={<Navigate to="/sign-in" replace />} />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

// Create a new query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Main App component
const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <LanguageProvider>
              <AuthProvider>
                <AppContent />
              </AuthProvider>
            </LanguageProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;

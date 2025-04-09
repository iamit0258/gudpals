import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider } from "@/providers/ClerkProvider";
import { LanguageProvider } from "@/context/language/LanguageContext";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Verify from "./pages/auth/Verify";
import Register from "./pages/auth/Register";
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

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/login" replace />
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
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/register" element={<Register />} />
        
        {/* Feature routes */}
        <Route path="/friends" element={<Friends />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/digitalLiteracy" element={<DigitalLiteracy />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/employment" element={<Employment />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/games" element={<Games />} />
        <Route path="/events" element={<Events />} />
        
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
      <ClerkProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <BrowserRouter>
              <LanguageProvider>
                <AppContent />
              </LanguageProvider>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ClerkProvider>
    </React.StrictMode>
  );
};

export default App;

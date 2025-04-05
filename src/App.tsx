
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

import Dashboard from "./pages/Dashboard";
import Fridge from "./pages/Fridge";
import Bakery from "./pages/Bakery";
import Rewards from "./pages/Rewards";
import Achievements from "./pages/Achievements";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// This will be replaced with actual authentication state from Supabase
const isAuthenticated = false;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
            <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
              <Route index element={<Dashboard />} />
              <Route path="fridge" element={<Fridge />} />
              <Route path="bakery" element={<Bakery />} />
              <Route path="rewards" element={<Rewards />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { CalculationProvider } from "./contexts/CalculationContext";
import Dashboard from "./pages/Dashboard";
import CivilPage from "./pages/CivilPage";
import LaborPage from "./pages/LaborPage";
import CriminalPage from "./pages/CriminalPage";
import DeadlinesPage from "./pages/DeadlinesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CalculationProvider>
          <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/civel" element={<CivilPage />} />
            <Route path="/trabalhista" element={<LaborPage />} />
            <Route path="/penal" element={<CriminalPage />} />
            <Route path="/prazos" element={<DeadlinesPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
        </CalculationProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

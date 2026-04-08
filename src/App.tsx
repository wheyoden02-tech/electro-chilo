import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import InteractiveZone from "./pages/InteractiveZone.tsx";
import { GamificationProvider } from "./context/UserStatsContext";
import { BadgeNotification } from "./components/gamification/BadgeNotification";
import { LevelUpOverlay } from "./components/gamification/LevelUpOverlay";
import { OnboardingFlow } from "./components/gamification/OnboardingFlow";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <GamificationProvider>
        <TooltipProvider>
          <OnboardingFlow />
          <LevelUpOverlay />
          <BadgeNotification />
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/retro-zone" element={<InteractiveZone />} />
            <Route path="/interactive-zone" element={<InteractiveZone />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </GamificationProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

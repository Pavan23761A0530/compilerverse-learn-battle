import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Simulator from "./pages/Simulator";
import PhaseChallenge from "./pages/PhaseChallenge";
import QuizPage from "./pages/Quiz";
import ErrorDetectivePage from "./pages/ErrorDetective";
import LeaderboardPage from "./pages/LeaderboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/phase-challenge" element={<PhaseChallenge />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/error-detective" element={<ErrorDetectivePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

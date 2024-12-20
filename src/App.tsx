import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Dashboard from "@/pages/Dashboard";
import Recharge from "@/pages/Recharge";
import Index from "@/pages/Index";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recharge" element={<Recharge />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminPixCodes } from "@/components/admin/AdminPixCodes";
import { AdminPaymentProofs } from "@/components/admin/AdminPaymentProofs";
import { AdminBets } from "@/components/admin/AdminBets";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

export default function Admin() {
  const { isAdmin, isLoading } = useAdminStatus();
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      console.log("No session found, redirecting to login");
      navigate("/login");
      return;
    }

    if (!isLoading && !isAdmin) {
      console.log("User is not admin, redirecting to dashboard");
      toast.error("Acesso negado. Você não tem permissão para acessar esta área.");
      navigate("/dashboard");
    }
  }, [session, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="pix-codes" element={<AdminPixCodes />} />
        <Route path="payment-proofs" element={<AdminPaymentProofs />} />
        <Route path="bets" element={<AdminBets />} />
      </Routes>
    </AdminLayout>
  );
}
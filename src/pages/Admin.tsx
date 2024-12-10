import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPixCodes } from "@/components/admin/AdminPixCodes";
import { AdminPaymentProofs } from "@/components/admin/AdminPaymentProofs";
import { AdminBets } from "@/components/admin/AdminBets";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { toast } from "@/hooks/use-toast";

const Admin = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useAdminStatus();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    } else if (!isLoading && !isAdmin) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta área."
      });
      navigate("/dashboard");
    }
  }, [session, isAdmin, isLoading, navigate]);

  if (isLoading || !isAdmin) {
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
};

export default Admin;
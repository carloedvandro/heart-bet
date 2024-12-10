import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { AdminBetsList } from "@/components/admin/AdminBetsList";
import { Card } from "@/components/ui/card";

export default function AdminBets() {
  return (
    <AdminLayout title="Apostas Detalhadas">
      <Card className="p-6">
        <AdminBetsList />
      </Card>
    </AdminLayout>
  );
}
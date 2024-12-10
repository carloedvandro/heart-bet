import { Card } from "@/components/ui/card";
import { AdminBetsList } from "./AdminBetsList";

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Apostas Detalhadas</h2>
        <AdminBetsList />
      </Card>
    </div>
  );
}
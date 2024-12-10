import { Link, useLocation } from "react-router-dom";
import { Settings2, QrCode, Receipt, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: Settings2 },
  { path: "/admin/pix-codes", label: "Códigos PIX", icon: QrCode },
  { path: "/admin/payment-proofs", label: "Comprovantes", icon: Receipt },
  { path: "/admin/bets", label: "Apostas", icon: Target },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white shadow-md">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>
          <nav className="mt-4">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50",
                  location.pathname === path && "bg-gray-50 text-pink-500 font-medium"
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
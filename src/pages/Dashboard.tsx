import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LogOut } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import HeartGrid from "@/components/HeartGrid";
import { toast } from "sonner";

type Bet = Database['public']['Tables']['bets']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

const getBetTypeName = (type: string): string => {
  const names: Record<string, string> = {
    simple_group: "Grupo Simples",
    dozen: "Dezena",
    hundred: "Centena",
    thousand: "Milhar",
    group_double: "Duque de Grupo",
    group_triple: "Terno de Grupo",
  };
  return names[type] || type;
};

const getDrawPeriodName = (period: string): string => {
  const names: Record<string, string> = {
    morning: "Manhã",
    afternoon: "Tarde",
    evening: "Noite",
    night: "Corujinha",
  };
  return names[period] || period;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      fetchProfile(session.user.id);
      fetchBets();
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      }
    });

    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Erro ao carregar perfil");
    }
  };

  const fetchBets = async () => {
    try {
      const { data, error } = await supabase
        .from("bets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBets(data || []);
    } catch (error) {
      console.error("Error fetching bets:", error);
      toast.error("Erro ao carregar apostas");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div 
      className="min-h-screen bg-gray-50 p-4 bg-cover bg-center relative"
      style={{
        backgroundImage: 'url("/lovable-uploads/5a0e0336-aecf-49bc-961c-013d9aee3443.png")',
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white">Corações Premiados</h1>
            <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-gray-600">Saldo:</span>
              <span className="ml-2 font-bold text-green-600">
                R$ {profile?.balance?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="bg-white/90 hover:bg-white">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>

        <Card className="bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle>Nova Aposta</CardTitle>
          </CardHeader>
          <CardContent>
            <HeartGrid />
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle>Suas Apostas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando...</p>
            ) : bets.length === 0 ? (
              <p>Você ainda não fez nenhuma aposta.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Números</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Prêmio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bets.map((bet) => (
                    <TableRow key={bet.id}>
                      <TableCell>
                        {new Date(bet.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {getDrawPeriodName(bet.draw_period)}
                      </TableCell>
                      <TableCell>
                        {getBetTypeName(bet.bet_type)}
                      </TableCell>
                      <TableCell>
                        {bet.numbers?.join(", ") || "N/A"}
                      </TableCell>
                      <TableCell>
                        R$ {Number(bet.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {bet.drawn_numbers ? bet.drawn_numbers.join(", ") : "Aguardando sorteio"}
                      </TableCell>
                      <TableCell>
                        {bet.prize_amount ? (
                          <span className="text-green-600 font-medium">
                            R$ {Number(bet.prize_amount).toFixed(2)}
                          </span>
                        ) : bet.is_winner === false ? (
                          <span className="text-red-600 font-medium">Não premiado</span>
                        ) : (
                          "Pendente"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LogOut } from "lucide-react";

interface Bet {
  id: string;
  created_at: string;
  hearts: string[];
  result: string | null;
  is_winner: boolean | null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
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
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Painel do Usuário</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>

        <Card>
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
                    <TableHead>Corações Escolhidos</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bets.map((bet) => (
                    <TableRow key={bet.id}>
                      <TableCell>
                        {new Date(bet.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {bet.hearts.join(", ")}
                      </TableCell>
                      <TableCell>
                        {bet.result || "Aguardando sorteio"}
                      </TableCell>
                      <TableCell>
                        {bet.is_winner === null ? (
                          "Pendente"
                        ) : bet.is_winner ? (
                          <span className="text-green-600 font-medium">Vencedor!</span>
                        ) : (
                          <span className="text-red-600 font-medium">Não ganhou</span>
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
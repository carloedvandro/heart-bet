import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Tentando fazer login com:", email);
      
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.error("Erro no login:", signInError);
        if (signInError.message.includes("Invalid login credentials")) {
          toast.error("Email ou senha incorretos");
        } else {
          toast.error("Erro ao fazer login. Tente novamente.");
        }
        return;
      }

      if (!session?.user) {
        toast.error("Erro ao iniciar sessão");
        return;
      }

      // Verificar se o usuário é admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error("Erro ao verificar perfil:", profileError);
        toast.error("Erro ao verificar permissões");
        return;
      }

      if (!profile?.is_admin) {
        // Se não for admin, fazer logout e mostrar erro
        await supabase.auth.signOut();
        toast.error("Acesso não autorizado");
        return;
      }

      // Se chegou até aqui, é um admin válido
      console.log("Login admin bem-sucedido");
      toast.success("Bem-vindo ao painel administrativo!");
      navigate("/admin");
      
    } catch (error) {
      console.error("Erro inesperado no login:", error);
      toast.error("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/login")}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 flex justify-center">
            <Shield className="h-12 w-12 text-primary" />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Área Administrativa
          </h1>
          <p className="text-gray-600 mt-2">
            Acesso restrito a administradores
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@exemplo.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
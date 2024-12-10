import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, LogIn, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Verificar sessão existente
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("Sessão ativa encontrada, redirecionando para dashboard");
        navigate("/dashboard", { replace: true });
      }
    };

    checkSession();
  }, [navigate]);

  // Monitorar mudanças no estado de autenticação
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Mudança no estado de autenticação:", event, session?.user?.id);
      
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Tentando login com:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Erro no login:", error);
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou senha incorretos");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Por favor, confirme seu email antes de fazer login");
        } else {
          toast.error("Erro ao fazer login. Por favor, tente novamente.");
        }
        return;
      }

      if (data?.session) {
        console.log("Login bem sucedido:", data.session.user.id);
        toast.success("Login realizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Ocorreu um erro inesperado. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: 'url("/lovable-uploads/5a0e0336-aecf-49bc-961c-013d9aee3443.png")',
      }}
    >
      {/* Overlay com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 animate-gradient-x" />
      
      {/* Overlay escuro com blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      
      <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-sm">
        <CardContent className="pt-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Bem-vindo de volta!
            </h1>
            <p className="text-sm text-gray-600">
              Entre com suas credenciais para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-pink-500 hover:bg-pink-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn className="mr-2 h-5 w-5" />
                  Entrar
                </div>
              )}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{" "}
              <button
                type="button"
                className="text-pink-500 hover:underline"
                onClick={() => toast.info("Funcionalidade em desenvolvimento")}
              >
                Cadastre-se
              </button>
            </p>
            <p className="text-sm text-gray-600">
              <button
                type="button"
                className="text-pink-500 hover:underline"
                onClick={() => toast.info("Funcionalidade em desenvolvimento")}
              >
                Esqueceu sua senha?
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
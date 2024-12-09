import { useLocation } from "react-router-dom";

export function LoginHeader() {
  const location = useLocation();
  const isSignUp = location.hash === "#signup";

  return (
    <div className="flex flex-col space-y-2 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        {isSignUp ? "Você está na tela de cadastro" : "Bem-vindo de volta!"}
      </h1>
      <p className="text-sm text-muted-foreground">
        {isSignUp
          ? "Por favor, digite um email e uma senha para fazer parte da nossa comunidade"
          : "Entre com seu email e senha para acessar sua conta"}
      </p>
    </div>
  );
}
interface AuthLinksProps {
  isResetMode: boolean;
  isSignUpMode: boolean;
  onResetMode: (value: boolean) => void;
  onSignUpMode: (value: boolean) => void;
}

export function AuthLinks({ 
  isResetMode, 
  isSignUpMode, 
  onResetMode, 
  onSignUpMode 
}: AuthLinksProps) {
  return (
    <div className="text-center space-y-2">
      {!isResetMode && !isSignUpMode && (
        <p className="text-sm">
          Não tem uma conta?{" "}
          <button
            type="button"
            onClick={() => {
              console.log("Clicou em Cadastre-se");
              onSignUpMode(true);
            }}
            className="text-pink-500 hover:text-pink-600 hover:underline focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-sm px-1 py-0.5 transition-colors"
          >
            Cadastre-se
          </button>
        </p>
      )}

      <p className="text-sm">
        {isResetMode ? (
          <>
            Lembrou sua senha?{" "}
            <button
              type="button"
              onClick={() => {
                console.log("Voltando ao login");
                onResetMode(false);
              }}
              className="text-pink-500 hover:text-pink-600 hover:underline focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-sm px-1 py-0.5 transition-colors"
            >
              Voltar ao login
            </button>
          </>
        ) : isSignUpMode ? (
          <>
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={() => {
                console.log("Voltando ao login do modo cadastro");
                onSignUpMode(false);
              }}
              className="text-pink-500 hover:text-pink-600 hover:underline focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-sm px-1 py-0.5 transition-colors"
            >
              Fazer login
            </button>
          </>
        ) : (
          <>
            Esqueceu sua senha?{" "}
            <button
              type="button"
              onClick={() => {
                console.log("Indo para recuperação de senha");
                onResetMode(true);
              }}
              className="text-pink-500 hover:text-pink-600 hover:underline focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-sm px-1 py-0.5 transition-colors"
            >
              Recuperar senha
            </button>
          </>
        )}
      </p>
    </div>
  );
}
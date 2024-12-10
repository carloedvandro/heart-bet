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
            className="text-pink-500 hover:underline focus:outline-none"
            onClick={() => onSignUpMode(true)}
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
              className="text-pink-500 hover:underline focus:outline-none"
              onClick={() => onResetMode(false)}
            >
              Voltar ao login
            </button>
          </>
        ) : isSignUpMode ? (
          <>
            Já tem uma conta?{" "}
            <button
              type="button"
              className="text-pink-500 hover:underline focus:outline-none"
              onClick={() => onSignUpMode(false)}
            >
              Fazer login
            </button>
          </>
        ) : (
          <>
            Esqueceu sua senha?{" "}
            <button
              type="button"
              className="text-pink-500 hover:underline focus:outline-none"
              onClick={() => onResetMode(true)}
            >
              Recuperar senha
            </button>
          </>
        )}
      </p>
    </div>
  );
}
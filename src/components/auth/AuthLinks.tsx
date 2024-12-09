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
    <div className="text-center mt-4 space-y-2">
      {!isResetMode && !isSignUpMode && (
        <p className="text-sm">
          Não tem uma conta?{" "}
          <span
            className="text-pink-500 cursor-pointer hover:underline"
            onClick={() => onSignUpMode(true)}
          >
            Cadastre-se
          </span>
        </p>
      )}

      <p className="text-sm">
        {isResetMode ? (
          <>
            Lembrou sua senha?{" "}
            <span
              className="text-pink-500 cursor-pointer hover:underline"
              onClick={() => onResetMode(false)}
            >
              Voltar ao login
            </span>
          </>
        ) : isSignUpMode ? (
          <>
            Já tem uma conta?{" "}
            <span
              className="text-pink-500 cursor-pointer hover:underline"
              onClick={() => onSignUpMode(false)}
            >
              Fazer login
            </span>
          </>
        ) : (
          <>
            Esqueceu sua senha?{" "}
            <span
              className="text-pink-500 cursor-pointer hover:underline"
              onClick={() => onResetMode(true)}
            >
              Recuperar senha
            </span>
          </>
        )}
      </p>
    </div>
  );
}
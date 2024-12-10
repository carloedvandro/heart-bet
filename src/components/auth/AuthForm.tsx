import { AuthFormProps } from "./types";
import { EmailInput } from "./form/EmailInput";
import { PasswordInput } from "./form/PasswordInput";
import { SubmitButton } from "./form/SubmitButton";

export function AuthForm({ 
  email, 
  setEmail, 
  password, 
  setPassword, 
  isLoading, 
  isResetMode,
  isSignUpMode,
  onSubmit 
}: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <EmailInput 
        email={email} 
        setEmail={setEmail} 
      />
      
      {!isResetMode && (
        <PasswordInput 
          password={password} 
          setPassword={setPassword} 
        />
      )}

      <SubmitButton 
        isLoading={isLoading}
        isResetMode={isResetMode}
        isSignUpMode={isSignUpMode}
      />
    </form>
  );
}
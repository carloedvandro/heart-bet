export interface AuthFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  isResetMode: boolean;
  isSignUpMode: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}
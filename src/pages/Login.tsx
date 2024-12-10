import { AuthConfig } from "@/components/auth/AuthConfig";
import { useAuthRedirect } from "@/components/auth/hooks/useAuthRedirect";

export default function Login() {
  const { isCheckingSession } = useAuthRedirect();

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500/30 to-pink-500/30">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
      </div>
    );
  }

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
      
      <AuthConfig />
    </div>
  );
}
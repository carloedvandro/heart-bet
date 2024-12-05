import { Card, CardContent } from "@/components/ui/card";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { AuthConfig } from "@/components/auth/AuthConfig";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";

export default function Login() {
  useAuthRedirect();

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{
        backgroundImage: 'url("/lovable-uploads/5a0e0336-aecf-49bc-961c-013d9aee3443.png")',
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <Card className="w-full max-w-md relative z-10 bg-white/95">
        <LoginHeader />
        <CardContent>
          <AuthConfig />
        </CardContent>
      </Card>
    </div>
  );
}
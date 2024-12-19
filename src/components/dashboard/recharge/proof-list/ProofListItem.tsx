import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "lucide-react";
import { format } from "date-fns";

interface ProofListItemProps {
  proof: {
    id: string;
    created_at: string;
    status: string;
  };
  imageUrl?: string;
  onImageClick: () => void;
  hasImageError: boolean;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'approved':
      return {
        label: 'Aprovado',
        variant: 'secondary' as const,
        className: 'bg-green-500/15 text-green-600'
      };
    case 'rejected':
      return {
        label: 'Rejeitado',
        variant: 'destructive' as const,
        className: 'bg-red-500/15 text-red-600'
      };
    case 'pending':
    default:
      return {
        label: 'Pendente',
        variant: 'outline' as const,
        className: 'bg-yellow-500/15 text-yellow-600'
      };
  }
};

export function ProofListItem({ proof, imageUrl, onImageClick, hasImageError }: ProofListItemProps) {
  const statusConfig = getStatusConfig(proof.status);
  
  return (
    <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent/50 transition-colors">
      <Avatar 
        className="h-16 w-16 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={onImageClick}
      >
        {!hasImageError && imageUrl ? (
          <AvatarImage
            src={imageUrl}
            alt="Comprovante"
            className="object-cover"
          />
        ) : (
          <AvatarFallback className="bg-muted">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">
          Comprovante #{proof.id.slice(0, 8)}
        </p>
        <p className="text-sm text-muted-foreground">
          Enviado em: {format(new Date(proof.created_at), 'dd/MM/yyyy HH:mm')}
        </p>
        <Badge variant={statusConfig.variant} className={statusConfig.className}>
          {statusConfig.label}
        </Badge>
        {hasImageError && (
          <p className="text-sm text-red-500">
            Imagem indisponível
          </p>
        )}
      </div>
    </div>
  );
}
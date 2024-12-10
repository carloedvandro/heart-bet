import { AdminAccessButton } from "./AdminAccessButton";
import { LogoutButton } from "./LogoutButton";

interface ProfileActionsProps {
  isAdmin: boolean;
  setProfile: (profile: any) => void;
}

export function ProfileActions({ isAdmin, setProfile }: ProfileActionsProps) {
  return (
    <div className="space-y-2">
      {isAdmin && <AdminAccessButton setProfile={setProfile} />}
      <LogoutButton />
    </div>
  );
}
import { AdminAccessButton } from "./AdminAccessButton";
import { Profile } from "@/integrations/supabase/custom-types";

interface ProfileActionsProps {
  isAdmin: boolean;
  setProfile: (profile: Profile | null) => void;
}

export function ProfileActions({ isAdmin, setProfile }: ProfileActionsProps) {
  return (
    <div className="space-y-2">
      {isAdmin && <AdminAccessButton setProfile={setProfile} />}
    </div>
  );
}
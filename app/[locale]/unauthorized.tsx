import PublicLayout from "@/src/layouts/public-layout";
import { UnauthorizedScreen } from "@/src/features/unauthorized/screens/UnauthorizedScreen";

export default function UnauthorizedPage() {
  return (
    <PublicLayout>
      <UnauthorizedScreen />
    </PublicLayout>
  );
}

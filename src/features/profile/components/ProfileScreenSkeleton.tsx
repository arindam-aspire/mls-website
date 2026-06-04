import { MyProfileCardSkeleton } from "@/src/features/profile/components/MyProfileCardSkeleton";
import { ProfilePageToolbarSkeleton } from "@/src/features/profile/components/ProfilePageToolbarSkeleton";

export function ProfileScreenSkeleton() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-2 md:gap-4 lg:gap-6">
      <ProfilePageToolbarSkeleton />
      <MyProfileCardSkeleton />
    </div>
  );
}

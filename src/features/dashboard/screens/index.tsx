import { ComingSoonCard } from "@/src/components/common/ComingSoonCard";

export default function DashboardScreen() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <ComingSoonCard
        title="Dashboard"
        description="Your personal dashboard is on the way. Stay tuned!"
      />
    </div>
  );
}

import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton lines={3} />
      <Skeleton lines={6} />
    </div>
  );
}

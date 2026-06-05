export function Skeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="border border-black bg-white p-4">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="mb-3 h-4 w-full bg-neutral-200 last:mb-0" />
      ))}
    </div>
  );
}

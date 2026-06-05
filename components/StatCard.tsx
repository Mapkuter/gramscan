export function StatCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="border border-black bg-white p-4">
      <p className="text-xs uppercase text-neutral-600">{label}</p>
      <p className="mt-2 truncate text-xl font-semibold">{value}</p>
      {detail ? <p className="mt-1 truncate text-xs text-neutral-600">{detail}</p> : null}
    </div>
  );
}

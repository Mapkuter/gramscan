"use client";

import { ErrorBox } from "@/components/DataTable";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="space-y-3">
      <ErrorBox message={error.message || "Unexpected app error"} />
      <button onClick={reset} className="border border-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white">
        Retry
      </button>
    </div>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { isNumeric, isTonAddress } from "@/lib/utils";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const [value, setValue] = useState("");
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = value.trim();
    if (!input) return;
    if (isTonAddress(input)) router.push(`/address/${encodeURIComponent(input)}`);
    else if (isNumeric(input)) router.push(`/block/${input}`);
    else router.push(`/tx/${encodeURIComponent(input)}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full gap-2">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-label="Search TON address, transaction hash, event id, or block seqno"
        placeholder="Search address, tx hash/event id, or block seqno"
        className={`min-w-0 flex-1 border border-black bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-black ${compact ? "h-10" : "h-12"}`}
      />
      <button className={`border border-black bg-black px-4 text-sm font-semibold text-white hover:bg-white hover:text-black ${compact ? "h-10" : "h-12"}`}>
        Search
      </button>
    </form>
  );
}

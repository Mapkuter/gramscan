"use client";

import { useState } from "react";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button onClick={copy} className="border border-black px-2 py-1 text-xs font-semibold hover:bg-black hover:text-white">
      {copied ? "Copied" : label}
    </button>
  );
}

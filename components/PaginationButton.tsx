"use client";

export function PaginationButton({ onClick, disabled, label = "Load more" }: { onClick?: () => void; disabled?: boolean; label?: string }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="border border-black px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:border-neutral-300 disabled:text-neutral-400 enabled:hover:bg-black enabled:hover:text-white"
    >
      {label}
    </button>
  );
}

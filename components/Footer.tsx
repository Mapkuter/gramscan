export function Footer() {
  return (
    <footer className="border-t border-black bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-neutral-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>GramScan explores live TON data through server-side API proxies.</p>
        <p>Placeholders are clearly marked where upstream data is unavailable.</p>
      </div>
    </footer>
  );
}

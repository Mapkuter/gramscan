import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";

const nav = [
  { href: "/", label: "Home" },
  { href: "/blocks", label: "Blocks" },
  { href: "/transactions", label: "Transactions" },
  { href: "/tokens", label: "Tokens" }
];

export function Header() {
  return (
    <header className="border-b border-black bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="text-xl font-bold tracking-normal">
            GramScan
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="border border-transparent px-3 py-2 hover:border-black">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <SearchBar compact />
      </div>
    </header>
  );
}

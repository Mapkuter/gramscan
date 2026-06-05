import { DataTable } from "@/components/DataTable";
import { SearchBar } from "@/components/SearchBar";

export const metadata = {
  title: "GramScan | TON Tokens",
  description: "Search TON jettons"
};

export default function TokensPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tokens</h1>
      <div className="border border-black bg-white p-4">
        <SearchBar />
      </div>
      <DataTable columns={["Token", "Symbol", "Supply", "Holders"]} rows={[]} empty="Placeholder: token rankings require a market/indexer data source." />
    </div>
  );
}

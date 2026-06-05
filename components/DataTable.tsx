import type { ReactNode } from "react";

export function DataTable({
  columns,
  rows,
  empty,
  error
}: {
  columns: string[];
  rows: ReactNode[][];
  empty?: string;
  error?: string;
}) {
  if (error) return <ErrorBox message={error} />;
  return (
    <div className="overflow-x-auto border border-black bg-white">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead className="border-b border-black bg-neutral-100 text-xs uppercase text-neutral-700">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-3 py-2 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, index) => (
              <tr key={index} className="border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="max-w-[220px] truncate px-3 py-2 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-3 py-8 text-center text-sm text-neutral-600">
                {empty || "No data available."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function ErrorBox({ message, detail }: { message: string; detail?: string }) {
  return (
    <div className="border border-black bg-white p-4">
      <p className="font-semibold">API error</p>
      <p className="mt-1 text-sm text-neutral-700">{message}</p>
      {detail ? <p className="mt-2 text-xs text-neutral-600">{detail}</p> : null}
    </div>
  );
}

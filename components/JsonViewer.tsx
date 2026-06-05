export function JsonViewer({ data }: { data: unknown }) {
  return (
    <pre className="max-h-[560px] overflow-auto border border-black bg-neutral-50 p-3 font-mono text-xs leading-5">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

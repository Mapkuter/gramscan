import Link from "next/link";

export default function NotFound() {
  return (
    <div className="border border-black bg-white p-6">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-neutral-600">The requested explorer page does not exist.</p>
      <Link href="/" className="mt-4 inline-block border border-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white">
        Back home
      </Link>
    </div>
  );
}

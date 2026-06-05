import QRCodeLib from "qrcode";

export async function QRCode({ value }: { value: string }) {
  const svg = await QRCodeLib.toString(value, {
    type: "svg",
    margin: 1,
    color: { dark: "#000000", light: "#ffffff" }
  });
  return <div className="h-36 w-36 border border-black p-2" dangerouslySetInnerHTML={{ __html: svg }} />;
}

export function shortHash(value?: string | null, head = 8, tail = 6) {
  if (!value) return "-";
  if (value.length <= head + tail + 3) return value;
  return `${value.slice(0, head)}...${value.slice(-tail)}`;
}

export function formatNanoTon(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return "-";
  const raw = typeof value === "number" ? BigInt(Math.trunc(value)) : BigInt(value);
  const sign = raw < 0n ? "-" : "";
  const abs = raw < 0n ? -raw : raw;
  const whole = abs / 1_000_000_000n;
  const fraction = (abs % 1_000_000_000n).toString().padStart(9, "0").replace(/0+$/, "");
  return `${sign}${whole.toLocaleString()}${fraction ? `.${fraction.slice(0, 4)}` : ""} TON`;
}

export function formatTokenAmount(value?: string | number | null, decimals = 9, symbol = "") {
  if (value === undefined || value === null || value === "") return "-";
  const raw = typeof value === "number" ? BigInt(Math.trunc(value)) : BigInt(value);
  const scale = 10n ** BigInt(Math.max(decimals, 0));
  const sign = raw < 0n ? "-" : "";
  const abs = raw < 0n ? -raw : raw;
  const whole = abs / scale;
  const fraction = (abs % scale).toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${sign}${whole.toLocaleString()}${fraction ? `.${fraction.slice(0, 4)}` : ""}${symbol ? ` ${symbol}` : ""}`;
}

export function formatUnixTime(seconds?: number | null) {
  if (!seconds) return "-";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(seconds * 1000));
}

export function isTonAddress(input: string) {
  const trimmed = input.trim();
  return /^(EQ|UQ)[A-Za-z0-9_-]{40,}$/.test(trimmed) || /^-?\d+:[A-Fa-f0-9]{64}$/.test(trimmed);
}

export function isNumeric(input: string) {
  return /^\d+$/.test(input.trim());
}

export function pickFirstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.length > 0) return value;
  }
  return "";
}

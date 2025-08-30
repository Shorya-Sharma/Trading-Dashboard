export async function fetchSymbols() {
  const res = await fetch("/api/symbols");
  return res.json();
}
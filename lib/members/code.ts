export function formatMemberCode(memberNumber: number): string {
  const padded = memberNumber <= 9999
    ? String(memberNumber).padStart(4, "0")
    : String(memberNumber);
  return `GYM-${padded}`;
}

export function parseMemberCode(code: string): number | null {
  if (!code || typeof code !== "string") return null;
  const trimmed = code.trim().toUpperCase();
  const hasPrefix = /^(GYM|BST)-/.test(trimmed);
  const normalized = trimmed.replace(/^(GYM|BST)-/, "");
  if (!/^\d+$/.test(normalized)) return null;
  // If without prefix, avoid treating phone numbers (>= 7 digits) as member numbers
  if (!hasPrefix && normalized.length > 6) return null;
  const parsed = parseInt(normalized, 10);
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 2147483647) return null;
  return parsed;
}


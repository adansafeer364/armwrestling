/** Format a number as Pakistani Rupees, e.g. 5000 -> "Rs 5,000". */
export function formatPKR(amount?: number | null): string {
  const n = typeof amount === 'number' && !Number.isNaN(amount) ? amount : 0;
  return `Rs ${n.toLocaleString('en-PK')}`;
}

/**
 * The support amount someone typed, as a number. "₦5,000", "5000" and
 * "5 000.50" all read; empty is null; anything else is NaN.
 */
export const parseAmount = (text) => {
  const cleaned = String(text ?? '').replace(/[₦,\s]/g, '').replace(/^NGN/i, '');
  if (cleaned === '') return null;
  return /^\d+(\.\d{1,2})?$/.test(cleaned) ? Number(cleaned) : Number.NaN;
};

/** "₦5,000" or "₦7,500.50" */
export const formatNaira = (amount) => {
  const value = Number(amount);
  if (!Number.isFinite(value)) return '';
  const decimals = Number.isInteger(value) ? 0 : 2;
  return `₦${value.toLocaleString('en-NG', { minimumFractionDigits: decimals, maximumFractionDigits: 2 })}`;
};

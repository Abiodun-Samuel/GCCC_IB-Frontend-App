import { memo, useCallback } from 'react';
import { Copy, Landmark } from 'lucide-react';
import { Toast } from '@/lib/toastify';

const Row = ({ label, value, copyLabel, onCopy }) => (
  <div className="flex items-center justify-between gap-4 py-3">
    <div className="min-w-0">
      <dt className="text-xs font-semibold text-(--hg-muted)">{label}</dt>
      <dd className="mt-0.5 break-words text-base font-bold text-(--hg-ink)">{value}</dd>
    </div>
    {onCopy && (
      <button
        type="button"
        onClick={onCopy}
        aria-label={copyLabel}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-(--hg-tint) px-3.5 py-1.5 text-sm font-semibold text-(--hg-brand) transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--hg-brand)/40"
      >
        <Copy size={14} aria-hidden="true" />
        Copy
      </button>
    )}
  </div>
);

/**
 * The account that support goes to, as the API serves it, with copy
 * buttons for the parts people paste into their banking app.
 */
const SupportAccountCard = ({ account, reference, className = '' }) => {
  const copy = useCallback(async (text, what) => {
    try {
      await navigator.clipboard.writeText(text);
      Toast.success(`${what} copied.`);
    } catch {
      Toast.error(`Couldn't copy the ${what.toLowerCase()}. Select it and copy it instead.`);
    }
  }, []);

  if (!account) return null;

  return (
    <div className={`rounded-2xl bg-(--hg-surface) p-5 text-(--hg-ink) sm:p-6 ${className}`}>
      <p className="flex items-center gap-2.5 text-base font-extrabold text-(--hg-ink)">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-(--hg-tint) text-(--hg-brand)">
          <Landmark size={18} aria-hidden="true" />
        </span>
        Account details
      </p>
      <dl className="mt-3 divide-y divide-(--hg-line)">
        <Row label="Bank" value={account.bank} />
        <Row
          label="Account number"
          value={<span className="tracking-wider tabular-nums">{account.account_number}</span>}
          copyLabel="Copy account number"
          onCopy={() => copy(account.account_number, 'Account number')}
        />
        <Row
          label="Account name"
          value={[account.account_name, account.branch].filter(Boolean).join(', ')}
        />
        {reference && (
          <Row
            label="Transfer description"
            value={reference}
            copyLabel="Copy transfer description"
            onCopy={() => copy(reference, 'Description')}
          />
        )}
      </dl>
    </div>
  );
};

export default memo(SupportAccountCard);

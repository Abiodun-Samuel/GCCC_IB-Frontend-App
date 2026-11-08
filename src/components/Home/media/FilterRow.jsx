import { memo } from 'react';
import { CATEGORY_META } from './mediaCategories';

const FilterPill = memo(({ catKey, active, onClick, count }) => {
  const meta = CATEGORY_META[catKey];
  if (!meta || !count) return null;
  const { Icon } = meta;

  return (
    <button
      type="button"
      onClick={() => onClick(catKey)}
      aria-pressed={active}
      className="flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-bold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      style={
        active
          ? {
              background: `linear-gradient(135deg, rgba(${meta.colorRGB},0.22) 0%, rgba(${meta.colorRGB},0.10) 100%)`,
              border: `1px solid rgba(${meta.colorRGB},0.32)`,
              color: '#fff',
            }
          : {
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.38)',
            }
      }
    >
      <Icon size={11} />
      {meta.label}
      <span
        className="flex h-[17px] min-w-[17px] items-center justify-center rounded-full px-1 text-[9px] font-black"
        style={
          active
            ? { background: `rgba(${meta.colorRGB},0.26)`, color: '#fff' }
            : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.28)' }
        }
      >
        {count}
      </span>
    </button>
  );
});
FilterPill.displayName = 'MediaHub.FilterPill';

const FilterRow = memo(({ counts, active, onChange }) => (
  <div
    className="mh-filter-scroll mb-8 flex items-center gap-2 overflow-x-auto pb-2"
    role="group"
    aria-label="Filter videos by category"
  >
    {Object.keys(CATEGORY_META).map((key) => (
      <FilterPill
        key={key}
        catKey={key}
        active={active === key}
        onClick={onChange}
        count={counts[key]}
      />
    ))}
  </div>
));
FilterRow.displayName = 'MediaHub.FilterRow';

export default FilterRow;

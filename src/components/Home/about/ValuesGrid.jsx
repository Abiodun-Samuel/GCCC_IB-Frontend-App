import { memo, useState } from 'react';
import { Crown, Heart, Users } from 'lucide-react';
import { BRAND } from '@/components/common/AnimatedBackground';
import Reveal from '@/components/Home/shared/Reveal';

const PRIMARY_DIM = 'rgba(17,155,214,0.12)';

const VALUES = [
  {
    id: 'love',
    icon: Heart,
    title: 'Love',
    body: 'Extending the love of Christ to every person, no conditions.',
    isDefault: false,
  },
  {
    id: 'family',
    icon: Users,
    title: 'Family',
    body: 'Close-knit believers carrying one another through every season.',
    isDefault: true,
  },
  {
    id: 'kingdom',
    icon: Crown,
    title: 'Kingdom',
    body: 'Kingdom culture practiced in every space we occupy.',
    isDefault: false,
  },
];

const ValueCard = memo(({ icon: Icon, title, body, isDefault, index }) => {
  const [hovered, setHovered] = useState(false);
  const active = isDefault || hovered;

  return (
    <Reveal
      delay={index * 0.1}
      className="relative flex cursor-default flex-col gap-5 overflow-hidden bg-gray-50 p-6 shadow transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 dark:bg-gray-900/70"
      style={active ? { backgroundColor: BRAND } : undefined}
      onMouseEnter={() => !isDefault && setHovered(true)}
      onMouseLeave={() => !isDefault && setHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center transition-colors duration-300"
          style={{ backgroundColor: active ? 'rgba(255,255,255,0.18)' : PRIMARY_DIM }}
        >
          <Icon
            className="h-5 w-5 transition-colors duration-300"
            style={{ color: active ? '#fff' : BRAND }}
            strokeWidth={1.8}
          />
        </div>
        <span
          className="select-none text-[11px] font-black tabular-nums tracking-widest transition-colors duration-300"
          style={{ color: active ? 'rgba(255,255,255,0.30)' : 'rgba(17,155,214,0.28)' }}
        >
          0{index + 1}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3
          className="text-base font-bold leading-snug transition-colors duration-300"
          style={{ color: active ? '#fff' : undefined }}
        >
          <span className={active ? '' : 'text-gray-900 dark:text-white'}>{title}</span>
        </h3>
        <p
          className="text-sm leading-relaxed transition-colors duration-300"
          style={{ color: active ? 'rgba(255,255,255,0.72)' : undefined }}
        >
          <span className={active ? '' : 'text-gray-500 dark:text-gray-400'}>{body}</span>
        </p>
      </div>

      <div
        className="mt-auto h-[2px] origin-left transition-all duration-500 ease-in-out"
        style={{
          backgroundColor: active ? 'rgba(255,255,255,0.32)' : BRAND,
          opacity: active ? 1 : 0.2,
          transform: active ? 'scaleX(1)' : 'scaleX(0.2)',
        }}
      />
    </Reveal>
  );
});
ValueCard.displayName = 'About.ValueCard';

const ValuesGrid = memo(() => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    {VALUES.map((v, i) => (
      <ValueCard key={v.id} {...v} index={i} />
    ))}
  </div>
));
ValuesGrid.displayName = 'About.ValuesGrid';

export default ValuesGrid;

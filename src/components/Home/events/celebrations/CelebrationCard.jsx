import { memo } from 'react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import {
  Anchor,
  Award,
  BookOpen,
  Cake,
  Calendar,
  Gift,
  Heart,
  Mail,
  Sparkles,
  Star,
} from 'lucide-react';

import Avatar from '@/components/ui/Avatar';
import { BRAND, BRAND_RGB } from '@/components/common/AnimatedBackground';
import { useModal } from '@/hooks/useModal';
import { generateInitials } from '@/utils/helper';
import { fmtShortDate } from '../eventFormat';
import SendMessageModal from './SendMessageModal';

const RED = '#e84545';
const RED_RGB = '232,69,69';
const TEAL = '#07c4b8';
const TEAL_RGB = '7,196,184';
const SKY = '#38bdf8';
const SKY_RGB = '56,189,248';
const CYAN = '#06b6d4';
const CYAN_RGB = '6,182,212';
const INDIGO = '#818cf8';
const INDIGO_RGB = '129,140,248';

const ANN_TYPE_CFG = {
  wedding: { color: RED, colorRGB: RED_RGB, Icon: Heart, label: 'Wedding Anniversary' },
  work: { color: SKY, colorRGB: SKY_RGB, Icon: Award, label: 'Work Anniversary' },
  salvation: { color: BRAND, colorRGB: BRAND_RGB, Icon: Sparkles, label: 'Salvation Date' },
  baptism: { color: TEAL, colorRGB: TEAL_RGB, Icon: Anchor, label: 'Baptism Date' },
  membership: { color: CYAN, colorRGB: CYAN_RGB, Icon: BookOpen, label: 'Membership Date' },
  ordination: { color: INDIGO, colorRGB: INDIGO_RGB, Icon: Star, label: 'Ordination Anniversary' },
  custom: { color: BRAND, colorRGB: BRAND_RGB, Icon: Gift, label: 'Special Date' },
};

/**
 * One celebrating member.
 *
 * Birthdays and anniversaries were two components that differed only by colour,
 * icon and label, so they share this shell now. The `Wish` button carries an
 * explicit aria-label because "Wish" alone does not say who it is for.
 */
const CelebrationCard = memo(({ person, index, color, colorRGB, Icon, label, dateStr }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const name = `${person.first_name} ${person.last_name}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
        className="relative flex shrink-0 items-center overflow-hidden rounded-2xl"
        style={{
          width: 'clamp(220px, 24vw, 296px)',
          height: 96,
          background: `linear-gradient(130deg, rgba(${colorRGB},0.10) 0%, rgba(255,255,255,0.03) 100%)`,
          border: `1px solid rgba(${colorRGB},0.16)`,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[3px]"
          style={{ background: `linear-gradient(180deg, ${color} 0%, rgba(${colorRGB},0.20) 100%)` }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-50 blur-2xl"
          style={{ background: `rgba(${colorRGB},0.20)` }}
        />

        <div className="relative z-10 shrink-0 self-center pl-5 pr-4">
          <div className="relative">
            <Avatar src={person.avatar} name={generateInitials(name)} size="sm" />
            <span
              aria-hidden="true"
              className="absolute -bottom-1 -right-1 flex h-[15px] w-[15px] items-center justify-center rounded-full"
              style={{
                background: `rgba(${colorRGB},0.22)`,
                border: `1px solid rgba(${colorRGB},0.40)`,
              }}
            >
              <Icon size={7} style={{ color }} />
            </span>
          </div>
        </div>

        <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-[5px] pr-4">
          <p className="truncate text-[13px] font-bold leading-tight text-white">{name}</p>
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-[10px] font-semibold" style={{ color }}>
              {label}
            </span>
            {dateStr && (
              <>
                <span className="shrink-0 text-[10px] text-white/20">&middot;</span>
                <Calendar
                  size={9}
                  className="shrink-0"
                  style={{ color: 'rgba(255,255,255,0.28)' }}
                />
                <span className="shrink-0 text-[10px] text-white/38">{dateStr}</span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={openModal}
            aria-label={`Send a message to ${name}`}
            className="flex self-start items-center gap-1 rounded-lg px-2 py-[4px] text-[10px] font-bold transition-all duration-150 hover:opacity-90 active:scale-[0.95]"
            style={{
              background: `rgba(${colorRGB},0.14)`,
              border: `1px solid rgba(${colorRGB},0.26)`,
              color,
            }}
          >
            <Mail size={9} />
            Wish
          </button>
        </div>
      </motion.div>

      <SendMessageModal isOpen={isOpen} onClose={closeModal} recipient={person} />
    </>
  );
});
CelebrationCard.displayName = 'Celebrations.Card';

export const BirthdayCard = memo(({ person, index }) => (
  <CelebrationCard
    person={person}
    index={index}
    color={RED}
    colorRGB={RED_RGB}
    Icon={Cake}
    label="Birthday"
    dateStr={dayjs(person.date_of_birth).format('MMM D')}
  />
));
BirthdayCard.displayName = 'Celebrations.BirthdayCard';

export const AnniversaryCard = memo(({ anniversary, person, index }) => {
  const cfg = ANN_TYPE_CFG[anniversary?.type ?? 'custom'] || ANN_TYPE_CFG.custom;
  return (
    <CelebrationCard
      person={person}
      index={index}
      color={cfg.color}
      colorRGB={cfg.colorRGB}
      Icon={cfg.Icon}
      label={anniversary?.title || cfg.label}
      dateStr={fmtShortDate(anniversary?.date)}
    />
  );
});
AnniversaryCard.displayName = 'Celebrations.AnniversaryCard';

export default CelebrationCard;

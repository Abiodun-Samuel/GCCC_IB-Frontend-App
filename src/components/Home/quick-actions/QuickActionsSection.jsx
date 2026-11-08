import { memo } from 'react';
import { MessageCircleQuestion, Sparkles } from 'lucide-react';

import { HandIcon } from '@/icons';
import AnimatedBackground, {
  BRAND,
  BRAND_RGB,
  PAGE_BG,
} from '@/components/common/AnimatedBackground';
import { QUICK_ACTION_LINKS, SECTION_SPACING } from '@/utils/constant';
import Reveal from '@/components/Home/shared/Reveal';
import SectionHeader from '@/components/Home/shared/SectionHeader';
import ActionCard from './ActionCard';

const CARD_META = [
  {
    num: '01',
    Icon: MessageCircleQuestion,
    label: 'Questions',
    title: 'Ask Anything',
    body: 'Bible questions, life questions, or anything you have not gotten answers to. Feel free to ask them all.',
    cta: 'Ask a question',
    color: '#0998d5',
    colorRGB: '9,152,213',
    light: '#e0f2fe',
  },
  {
    num: '02',
    Icon: HandIcon,
    label: 'Prayer',
    title: 'Prayer Request',
    body: 'Send your prayer requests knowing that whatever we ask in His name, He will do it. Let us together glorify the Father.',
    cta: 'Send a request',
    color: '#b45309',
    colorRGB: '180,83,9',
    light: '#fef3c7',
  },
  {
    num: '03',
    Icon: Sparkles,
    label: 'Testimony',
    title: 'Share Your Testimony',
    body: 'At GCCC Ibadan we have a culture of sharing what the Lord has done. Let your testimony encourage the whole family.',
    cta: 'Share a testimony',
    color: '#059669',
    colorRGB: '5,150,105',
    light: '#d1fae5',
  },
];

const QuoteStrip = memo(() => (
  <Reveal
    className="relative overflow-hidden rounded px-8 py-10 sm:px-12 sm:py-12"
    style={{ backgroundColor: PAGE_BG }}
  >
    <AnimatedBackground withBaseBg />

    <div
      aria-hidden="true"
      className="animate-glow-pulse pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{ background: `radial-gradient(circle, rgba(${BRAND_RGB},0.12) 0%, transparent 68%)` }}
    />

    <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-10">
      <div
        aria-hidden="true"
        className="hidden w-0.5 shrink-0 self-stretch rounded-full sm:block"
        style={{ background: `linear-gradient(to bottom, ${BRAND}, transparent)` }}
      />
      <div className="flex flex-col gap-3 text-center sm:text-left">
        <p
          className="text-[10px] font-black uppercase tracking-[0.24em]"
          style={{ color: `rgba(${BRAND_RGB},0.55)` }}
        >
          John 14:13
        </p>
        <blockquote className="text-xl font-bold leading-snug text-white sm:text-2xl">
          Whatever you ask in my name, this I will do, that the Father may be glorified in the Son.
        </blockquote>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Ask, pray, and share with a family that genuinely cares.
        </p>
      </div>
    </div>
  </Reveal>
));
QuoteStrip.displayName = 'QA.QuoteStrip';

const QuickActionsSection = () => (
  <section
    className={`relative w-full overflow-hidden bg-white dark:bg-gray-950 ${SECTION_SPACING}`}
    aria-label="Ask, pray and share"
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-30"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(9,152,213,0.10) 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
      }}
    />

    <div className="container relative z-10 mx-auto flex flex-col px-2">
      <SectionHeader
        tone="light"
        eyebrow="Get Involved"
        titleLead="Ask, Pray,"
        titleAccent="& Share"
        subtitle="We are more than a church. Ask questions, send prayer requests, and share what God has done in your life."
      />
    </div>

    <div className="container relative z-10 mx-auto flex flex-col gap-10 px-2 sm:gap-12">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
        {QUICK_ACTION_LINKS.map((link, index) => (
          <ActionCard
            key={link.alt ?? index}
            meta={CARD_META[index] ?? CARD_META[0]}
            link={link}
            index={index}
          />
        ))}
      </div>
      <QuoteStrip />
    </div>
  </section>
);

export default memo(QuickActionsSection);

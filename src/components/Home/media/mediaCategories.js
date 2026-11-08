import { BookOpen, Headphones, Mic2, Play, Radio, Star, Tv2 } from 'lucide-react';
import { BRAND, BRAND_RGB } from '@/components/common/AnimatedBackground';

/** Derives a category from the video title. Unchanged from the original MediaHub. */
export const getCategory = (title) => {
  const t = String(title).toUpperCase();
  if (t.includes('SUNDAY SERVICE')) return 'sunday';
  if (t.includes('TUESDAY SERVICE')) return 'tuesday';
  if (t.includes('FRIDAY SERVICE')) return 'friday';
  if (t.includes('DIVINE DEMAND') || t.includes('PRAYER SCHOOL')) return 'teaching';
  if (t.includes('CROSS OVER') || t.includes('UNDIVIDED')) return 'special';
  return 'shorts';
};

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const CATEGORY_META = {
  all: { label: 'All', Icon: Tv2, color: BRAND, colorRGB: BRAND_RGB },
  sunday: { label: 'Sunday', Icon: Star, color: '#f59e0b', colorRGB: '245,158,11' },
  tuesday: { label: 'Tuesday', Icon: BookOpen, color: '#10b981', colorRGB: '16,185,129' },
  friday: { label: 'Friday', Icon: Mic2, color: '#8b5cf6', colorRGB: '139,92,246' },
  teaching: { label: 'Teaching', Icon: Radio, color: BRAND, colorRGB: BRAND_RGB },
  special: { label: 'Special', Icon: Headphones, color: '#ec4899', colorRGB: '236,72,153' },
  shorts: { label: 'Shorts', Icon: Play, color: '#f43f5e', colorRGB: '244,63,94' },
};

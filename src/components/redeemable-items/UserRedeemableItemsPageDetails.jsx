// ─── UserRedeemableItemsPageDetails.jsx ──────────────────────────────────────

import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag, ChevronDown, ChevronUp, AlertCircle,
    Package, Users, Sparkles, CheckSquare, UserCircle,
    MessageSquare, PlayCircle, CalendarCheck, FileText,
    LogIn, Star,
} from 'lucide-react';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/modal/Modal';
import { useModal } from '@/hooks/useModal';
import { useRedeemableItems, useRedeemItem } from '@/queries/redeemable-items.query';
import { useAuthStore } from '@/store/auth.store';

// ─── Brand palette derived from #0998d5 ───────────────────────────────────────
const C = {
    bg50: 'bg-[#e8f6fc] dark:bg-[#02304a]/30',
    bg100: 'bg-[#bfe5f6] dark:bg-[#044e6e]/30',
    bg500: 'bg-[#0998d5]',
    bg600: 'bg-[#0880b5]',
    border200: 'border-[#7fccee] dark:border-[#06638a]/60',
    border500: 'border-[#0998d5]',
    text400: 'text-[#2aaedd] dark:text-[#2aaedd]',
    text500: 'text-[#0998d5] dark:text-[#2aaedd]',
    text600: 'text-[#0880b5] dark:text-[#2aaedd]',
    text700: 'text-[#06638a] dark:text-[#7fccee]',
    hoverBg50: 'hover:bg-[#e8f6fc] dark:hover:bg-[#02304a]/30',
};

// ─── Points Guide Data — synced with PHP PointRewards config ──────────────────
// attendance.marked=15  attendance.usher_marked=10  profile.updated=10
// engagement.message_sent=5  engagement.message_replied=5  engagement.followup_submitted=10
// media.video_watched=30  media.audio_listened=20
// events.registered=10  forms.submitted=5  session.login=5

const POINTS_GUIDE = [
    {
        group: 'Attendance',
        icon: CheckSquare,
        actions: [
            { label: 'Mark Attendance', points: 15 },
            { label: 'Usher Attendance', points: 10 },
        ],
    },
    {
        group: 'Profile',
        icon: UserCircle,
        actions: [
            { label: 'Update Profile', points: 10 },
        ],
    },
    {
        group: 'Engagement',
        icon: MessageSquare,
        actions: [
            { label: 'Send a Message', points: 5 },
            { label: 'Reply to Message', points: 5 },
            { label: 'Submit Follow-up', points: 10 },
        ],
    },
    {
        group: 'Media',
        icon: PlayCircle,
        actions: [
            { label: 'Watch a Video (YouTube)', points: 30 },
            { label: 'Listen to Audio (Spotify)', points: 20 },
        ],
    },
    {
        group: 'Events',
        icon: CalendarCheck,
        actions: [{ label: 'Register for Event', points: 10 }],
    },
    {
        group: 'Forms',
        icon: FileText,
        actions: [{ label: 'Submit a Form', points: 5 }],
    },
    {
        group: 'Session',
        icon: LogIn,
        actions: [{ label: 'Daily Login', points: 5 }],
    },
];

// ─── Coin Icon ─────────────────────────────────────────────────────────────────

const CoinIcon = ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="M12 7v1m0 8v1M9.5 10.5h3a1.5 1.5 0 0 1 0 3h-3m0-3v3m0-3h-.5m3.5 3h.5" />
    </svg>
);

// ─── Skeleton ──────────────────────────────────────────────────────────────────

const Pulse = ({ className }) => (
    <div className={`bg-gray-200 dark:bg-gray-700/60 rounded-xl animate-pulse ${className}`} />
);

const SkeletonCard = memo(() => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
        <Pulse className="h-44 rounded-none" />
        <div className="p-4 space-y-3">
            <Pulse className="h-4 w-3/4" />
            <Pulse className="h-3 w-1/2" />
            <div className="flex items-center justify-between pt-2">
                <Pulse className="h-5 w-16 rounded-full" />
                <Pulse className="h-8 w-24 rounded-lg" />
            </div>
        </div>
    </div>
));
SkeletonCard.displayName = 'SkeletonCard';

// ─── Balance Chip ──────────────────────────────────────────────────────────────

const BalanceChip = memo(({ points }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-sm ${C.bg50} ${C.border200} border`}
    >
        <CoinIcon className={`w-4 h-4 ${C.text500}`} />
        <span className={`text-sm font-bold tabular-nums ${C.text600}`}>
            {(points ?? 0).toLocaleString()}
        </span>
        <span className={`text-xs font-medium ${C.text400} opacity-80`}>points</span>
    </motion.div>
));
BalanceChip.displayName = 'BalanceChip';

// ─── Points Guide — Redesigned ─────────────────────────────────────────────────

const MAX_POINTS = 30; // video watched is the highest at 30 — used to normalise bars

const PointsGuide = memo(() => {
    const [open, setOpen] = useState(false);

    return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm">

            {/* Trigger row */}
            <button
                onClick={() => setOpen(v => !v)}
                className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-150 ${C.hoverBg50}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${C.bg50} ${C.border200} border`}>
                        <Star size={14} className={C.text500} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            How to Earn Points
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Complete activities to build your balance
                        </p>
                    </div>
                </div>
                <div className={`flex-shrink-0 ${C.text500}`}>
                    {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700">

                            {/* Category cards grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
                                {POINTS_GUIDE.map((group, gi) => {
                                    const Icon = group.icon;
                                    const groupMax = group.actions.reduce((s, a) => s + a.points, 0);

                                    return (
                                        <motion.div
                                            key={group.group}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: gi * 0.04, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                                            className="relative bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 flex flex-col gap-3 border border-gray-100 dark:border-gray-600/50 overflow-hidden"
                                        >
                                            {/* Brand accent top line */}
                                            <div
                                                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
                                                style={{ background: 'linear-gradient(90deg, #0998d5, #2aaedd88)' }}
                                            />

                                            {/* Group header */}
                                            <div className="flex items-center justify-between pt-0.5">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-7 h-7 rounded-lg ${C.bg50} ${C.border200} border flex items-center justify-center flex-shrink-0`}>
                                                        <Icon size={13} className={C.text500} />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200 tracking-wide">
                                                        {group.group}
                                                    </span>
                                                </div>
                                                {/* Max earnable badge */}
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${C.bg50} ${C.text500} tabular-nums flex-shrink-0`}>
                                                    up to +{groupMax}
                                                </span>
                                            </div>

                                            {/* Divider */}
                                            <div className="h-px bg-gray-200 dark:bg-gray-600/60" />

                                            {/* Action rows */}
                                            <div className="flex flex-col gap-2.5">
                                                {group.actions.map((action, ai) => {
                                                    const barPct = Math.round((action.points / MAX_POINTS) * 100);
                                                    return (
                                                        <div key={action.label} className="flex flex-col gap-1">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="text-xs text-gray-600 dark:text-gray-300 leading-snug flex-1 min-w-0 truncate">
                                                                    {action.label}
                                                                </span>
                                                                <span className={`text-xs font-bold tabular-nums flex-shrink-0 ${C.text500}`}>
                                                                    +{action.points}
                                                                </span>
                                                            </div>
                                                            {/* Relative weight bar */}
                                                            <div className="h-1 rounded-full bg-gray-200 dark:bg-gray-600/60 overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${barPct}%` }}
                                                                    transition={{
                                                                        delay: gi * 0.04 + ai * 0.04 + 0.12,
                                                                        duration: 0.55,
                                                                        ease: [0.22, 1, 0.36, 1],
                                                                    }}
                                                                    className="h-full rounded-full"
                                                                    style={{ background: 'linear-gradient(90deg, #0998d5, #2aaedd)' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Footer note */}
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-3 text-center">
                                Points are awarded once per qualifying action per day where applicable
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});
PointsGuide.displayName = 'PointsGuide';

// ─── Redeem Modal ──────────────────────────────────────────────────────────────

const RedeemModal = memo(({ isOpen, onClose, item, userPoints, onConfirm, isLoading }) => {
    if (!item) return null;

    const canAfford = (userPoints ?? 0) >= item.points_required;
    const remaining = (userPoints ?? 0) - item.points_required;
    const shortfall = item.points_required - (userPoints ?? 0);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Confirm Redemption" maxWidth="max-w-md">
            <div className="space-y-4">
                <div className={`flex items-center gap-4 p-4 rounded-xl ${C.bg50} ${C.border200} border`}>
                    {item.image ? (
                        <img src={item.image} alt={item.title}
                            className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-gray-200 dark:border-gray-600" />
                    ) : (
                        <div className={`w-14 h-14 rounded-xl ${C.bg100} flex items-center justify-center flex-shrink-0`}>
                            <ShoppingBag size={22} className={C.text500} />
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{item.title}</p>
                        {item.subtitle && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{item.subtitle}</p>
                        )}
                        <div className="flex items-center gap-1 mt-1.5">
                            <CoinIcon className={`w-3.5 h-3.5 ${C.text500}`} />
                            <span className={`text-sm font-bold ${C.text600}`}>
                                {item.points_required.toLocaleString()} pts
                            </span>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Your balance</span>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                            <CoinIcon className={`w-3 h-3 ${C.text500}`} />
                            {(userPoints ?? 0).toLocaleString()} pts
                        </span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Cost</span>
                        <span className="text-xs font-semibold text-red-500 dark:text-red-400">
                            − {item.points_required.toLocaleString()} pts
                        </span>
                    </div>
                    <div className={`flex items-center justify-between px-4 py-3 ${canAfford ? C.bg50 : 'bg-red-50 dark:bg-red-950/20'}`}>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {canAfford ? 'Remaining' : 'Shortfall'}
                        </span>
                        <span className={`text-xs font-bold ${canAfford ? C.text600 : 'text-red-500 dark:text-red-400'}`}>
                            {canAfford
                                ? `${remaining.toLocaleString()} pts`
                                : `Need ${shortfall.toLocaleString()} more pts`}
                        </span>
                    </div>
                </div>

                {!canAfford && (
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-700">
                        <AlertCircle size={14} className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            You don't have enough points yet. Keep engaging with the community to earn more!
                        </p>
                    </div>
                )}

                <div className="flex gap-3 pt-1">
                    <Button variant="outline-light" onClick={onClose} className="flex-1" disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary" onClick={onConfirm}
                        loading={isLoading} disabled={!canAfford}
                        className="flex-1"
                        startIcon={<ShoppingBag size={14} />}
                    >
                        Redeem Now
                    </Button>
                </div>
            </div>
        </Modal>
    );
});
RedeemModal.displayName = 'RedeemModal';

// ─── Item Card ─────────────────────────────────────────────────────────────────

const ItemCard = memo(({ item, userPoints, onRedeem, index }) => {
    const canAfford = (userPoints ?? 0) >= item.points_required;
    const isUnavailable = !item.is_available || !item.is_active;
    const lowStock = item.stock !== null && item.stock !== undefined && item.stock <= 5;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md hover:shadow-[#0998d5]/8 dark:hover:shadow-[#0998d5]/10 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
        >
            <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700/50 aspect-[4/3]">
                {item.image ? (
                    <img src={item.image} alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center ${C.bg50}`}>
                        <ShoppingBag size={36} className={`${C.text500} opacity-40`} />
                    </div>
                )}
                {isUnavailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold uppercase tracking-widest">Unavailable</span>
                    </div>
                )}
                {lowStock && !isUnavailable && (
                    <div className="absolute top-2.5 right-2.5">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-500/90 text-white backdrop-blur-sm shadow-sm">
                            {item.stock} left
                        </span>
                    </div>
                )}
                {item.category && (
                    <div className="absolute bottom-2.5 left-2.5">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/90 dark:bg-gray-900/80 text-gray-600 dark:text-gray-300 backdrop-blur-sm border border-white/40 dark:border-gray-700/40">
                            {item.category}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1 gap-3">
                <div className="flex-1 space-y-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-1">
                        {item.title}
                    </h3>
                    {item.subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.subtitle}</p>
                    )}
                    {item.description && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2 pt-0.5">
                            {item.description}
                        </p>
                    )}
                </div>
                {item.total_redeemed > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                        <Users size={11} />
                        <span>{item.total_redeemed} redeemed</span>
                    </div>
                )}
                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-1">
                        <CoinIcon className={`w-3.5 h-3.5 flex-shrink-0 ${canAfford && !isUnavailable ? C.text500 : 'text-gray-400 dark:text-gray-500'}`} />
                        <span className={`text-sm font-bold tabular-nums ${canAfford && !isUnavailable ? C.text600 : 'text-gray-400 dark:text-gray-500'}`}>
                            {item.points_required.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">pts</span>
                    </div>
                    <Button
                        variant={canAfford && !isUnavailable ? 'primary' : 'outline-light'}
                        onClick={() => !isUnavailable && onRedeem(item)}
                        disabled={isUnavailable}
                        className="!text-xs !px-3 !py-1.5 !h-auto flex-shrink-0"
                        startIcon={<ShoppingBag size={11} />}
                    >
                        {isUnavailable ? 'Unavailable' : canAfford ? 'Redeem' : 'Need pts'}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
});
ItemCard.displayName = 'ItemCard';

// ─── Empty State ───────────────────────────────────────────────────────────────

const EmptyState = memo(() => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="col-span-full flex flex-col items-center gap-4 py-20 text-center"
    >
        <div className={`w-16 h-16 rounded-2xl ${C.bg50} ${C.border200} border flex items-center justify-center`}>
            <Package size={28} className={`${C.text500} opacity-50`} />
        </div>
        <div>
            <p className="font-semibold text-gray-500 dark:text-gray-400">No items available yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Check back soon for exciting rewards!</p>
        </div>
    </motion.div>
));
EmptyState.displayName = 'EmptyState';

// ─── Main ──────────────────────────────────────────────────────────────────────

const UserRedeemableItemsPageDetails = () => {
    const { user } = useAuthStore();
    const userPoints = user?.reward_points ?? 0;

    const [pendingItem, setPendingItem] = useState(null);
    const redeemModal = useModal(false);

    const { data, isLoading } = useRedeemableItems();
    const { mutate: redeemItem, isPending: isRedeeming } = useRedeemItem({
        onSuccess: redeemModal.closeModal,
    });

    const items = data?.data ?? [];

    const handleRedeemClick = useCallback((item) => {
        setPendingItem(item);
        redeemModal.openModal();
    }, [redeemModal]);

    const handleConfirmRedeem = useCallback(() => {
        if (!pendingItem) return;
        redeemItem({ item_id: pendingItem.id });
    }, [pendingItem, redeemItem]);

    const handleCloseModal = useCallback(() => {
        redeemModal.closeModal();
        setPendingItem(null);
    }, [redeemModal]);

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={17} className={C.text500} />
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Reward Store</h1>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Redeem your points for exclusive rewards and gifts
                    </p>
                </div>
                <BalanceChip points={userPoints} />
            </div>

            <PointsGuide />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                    : items.length > 0
                        ? items.map((item, index) => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                userPoints={userPoints}
                                onRedeem={handleRedeemClick}
                                index={index}
                            />
                        ))
                        : <EmptyState />
                }
            </div>

            <RedeemModal
                isOpen={redeemModal.isOpen}
                onClose={handleCloseModal}
                item={pendingItem}
                userPoints={userPoints}
                onConfirm={handleConfirmRedeem}
                isLoading={isRedeeming}
            />
        </div>
    );
};

export default UserRedeemableItemsPageDetails;
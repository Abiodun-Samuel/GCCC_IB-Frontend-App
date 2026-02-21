import Badge from '@/components/ui/Badge';
import {
  CalendarIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  CircleIcon,
  DocumentIcon,
  PendingIcon,
  PhoneIcon,
  ShareIcon,
  UserIcon,
} from '@/icons';
import { formatFullDateTime, getTimeAgo } from '@/utils/helper';
import { useState } from 'react';

const typeColors = {
  prayer: 'purple',
  question: 'primary',
  testimony: 'success',
};

const typeConfig = {
  prayer: {
    gradient: 'from-purple-500/10 to-violet-500/5',
    accent: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800/50',
    dot: 'bg-purple-500',
  },
  question: {
    gradient: 'from-blue-500/10 to-indigo-500/5',
    accent: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/50',
    dot: 'bg-blue-500',
  },
  testimony: {
    gradient: 'from-emerald-500/10 to-teal-500/5',
    accent: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    dot: 'bg-emerald-500',
  },
};

function Avatar({ user, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
  };

  const initials =
    user?.first_name && user?.last_name
      ? `${user.first_name[0]}${user.last_name[0]}`
      : user?.first_name?.[0] ?? '?';

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={`${user.first_name} ${user.last_name}`}
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center font-semibold text-white ring-2 ring-white dark:ring-gray-800 shrink-0`}
    >
      {initials}
    </div>
  );
}

export default function FormCard({ person, selected = false, onToggleSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const config = typeConfig[person?.type] || {
    gradient: 'from-gray-500/10 to-gray-400/5',
    accent: 'text-gray-600 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-700',
    dot: 'bg-gray-400',
  };

  const hasUser = !!person?.user;
  const displayName = hasUser
    ? `${person.user.first_name} ${person.user.last_name}`
    : person?.name ?? null;
  const displayPhone = hasUser
    ? person.user.phone_number
    : person?.phone_number ?? null;

  const handleCardClick = (e) => {
    if (e.target.closest('[data-expand-button]')) return;
    onToggleSelect?.(!selected);
  };

  const handleExpandClick = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <div
        onClick={handleCardClick}
        className={`group relative bg-white dark:bg-gray-900 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden
          ${selected
            ? 'border-blue-300 dark:border-blue-700 shadow-lg shadow-blue-100/50 dark:shadow-blue-900/20'
            : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md'
          }`}
      >
        {/* Top accent strip */}
        <div className={`h-0.5 w-full bg-gradient-to-r ${config.gradient} opacity-80`} />

        {/* Selection indicator */}
        {selected && (
          <div className="absolute left-0 top-0.5 bottom-0 w-0.5 bg-blue-500 rounded-r-full" />
        )}

        <div className="px-4 py-4 sm:px-5 sm:py-4">
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect?.(!selected);
              }}
              className="mt-0.5 transition-transform shrink-0 hover:scale-110"
            >
              {selected ? (
                <CheckCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              ) : (
                <CircleIcon className="w-5 h-5 text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500" />
              )}
            </button>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Header row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Avatar or icon */}
                  {hasUser ? (
                    <Avatar user={person.user} size="sm" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                      <UserIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}

                  <div className="min-w-0">
                    {displayName ? (
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate leading-tight">
                        {displayName}
                      </p>
                    ) : (
                      <p className="text-sm font-medium text-gray-400 dark:text-gray-600 italic leading-tight">
                        Anonymous
                      </p>
                    )}
                    {hasUser && person.user.email && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate leading-tight mt-0.5">
                        {person.user.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right badges */}
                <div className="flex items-center gap-2 shrink-0">
                  {person?.is_completed ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                      <CheckBadgeIcon className="w-3.5 h-3.5" />
                      Treated
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                      <PendingIcon className="w-3.5 h-3.5" />
                      Pending
                    </span>
                  )}

                  {/* Expand button */}
                  <button
                    data-expand-button
                    onClick={handleExpandClick}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 transition-colors"
                  >
                    <ChevronDownIcon
                      className={`w-3.5 h-3.5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
              </div>

              {/* Content preview */}
              {person?.content && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-3">
                  {person.content}
                </p>
              )}

              {/* Footer meta row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Type badge */}
                  {person?.type && (
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${config.accent}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                      {person.type.charAt(0).toUpperCase() + person.type.slice(1)}
                    </span>
                  )}

                  {displayPhone && (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                      <PhoneIcon className="w-3.5 h-3.5" />
                      {displayPhone}
                    </span>
                  )}

                  {hasUser && person.user.gender && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded-md">
                      {person.user.gender}
                    </span>
                  )}

                  {person?.wants_to_share_testimony && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                      <ShareIcon className="w-3 h-3" />
                      Wants to share
                    </span>
                  )}
                </div>

                <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 shrink-0">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {getTimeAgo(person?.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded details panel — outside the card, below it */}
      {isOpen && (
        <div className="mt-1 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Panel header */}
          <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DocumentIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Full Details
              </span>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatFullDateTime(person.created_at)}
            </span>
          </div>

          <div className="p-5 space-y-4">
            {/* User info block — shown only if user object exists */}
            {hasUser && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100 dark:border-blue-900/30">
                <Avatar user={person.user} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {person.user.first_name} {person.user.last_name}
                  </p>
                  {person.user.email && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {person.user.email}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {person.user.phone_number && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <PhoneIcon className="w-3 h-3" />
                        {person.user.phone_number}
                      </span>
                    )}
                    {person.user.gender && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded-md border border-gray-100 dark:border-gray-700">
                        {person.user.gender}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Content block */}
            {person?.content && (
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                  Message
                </p>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50">
                  <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {person.content}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
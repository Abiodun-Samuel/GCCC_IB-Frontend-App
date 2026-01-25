import React, { useState, useCallback } from 'react';
import { Mail, ChevronLeft, Send, CheckCheck, Inbox as InboxIcon, MessagesSquareIcon, Clock, User, Sparkles } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { useInboxMessages, useReplyToMessage, useMarkAsRead } from '@/queries/message.query';
import PageMeta from '@/components/common/PageMeta';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

// ============================================================================
// SKELETON LOADERS
// ============================================================================

const MessageListSkeleton = () => (
    <div className="space-y-3 p-4 sm:p-6">
        {[...Array(5)].map((_, index) => (
            <div
                key={index}
                className="animate-pulse rounded-3xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 p-4 shadow sm:p-5 dark:border-gray-800 dark:from-gray-800/50 dark:to-gray-900/50"
                style={{ animationDelay: `${index * 100}ms` }}
            >
                <div className="flex gap-3 sm:gap-4">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
                    <div className="flex-1 space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="h-4 w-24 sm:h-5 sm:w-32 rounded-lg bg-gray-200 dark:bg-gray-700" />
                            <div className="h-3 w-12 sm:h-4 sm:w-16 rounded-md bg-gray-150 dark:bg-gray-750" />
                        </div>
                        <div className="h-3 w-32 sm:h-4 sm:w-48 rounded-md bg-gray-150 dark:bg-gray-750" />
                        <div className="h-3 w-full rounded-md bg-gray-100 dark:bg-gray-800" />
                        <div className="h-3 w-3/4 rounded-md bg-gray-100 dark:bg-gray-800" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const MessageDetailSkeleton = () => (
    <div className="flex h-full flex-col">
        <div className="border-b border-gray-100 bg-white/90 p-4 sm:p-6 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/90">
            <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-10 w-20 sm:h-11 sm:w-24 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700" />
            </div>
        </div>
        <div className="flex-1 space-y-6 sm:space-y-8 p-6 sm:p-8 lg:p-10">
            <div className="flex items-start gap-4 sm:gap-6 border-b border-gray-100 pb-6 sm:pb-8 dark:border-gray-800">
                <div className="h-16 w-16 sm:h-20 sm:w-20 animate-pulse rounded-3xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
                <div className="flex-1 space-y-3 sm:space-y-4">
                    <div className="h-6 w-32 sm:h-7 sm:w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-48 sm:w-64 animate-pulse rounded-md bg-gray-150 dark:bg-gray-750" />
                </div>
            </div>
            <div className="space-y-2 sm:space-y-3">
                <div className="h-4 w-full animate-pulse rounded-md bg-gray-150 dark:bg-gray-750" />
                <div className="h-4 w-full animate-pulse rounded-md bg-gray-150 dark:bg-gray-750" />
                <div className="h-4 w-5/6 animate-pulse rounded-md bg-gray-150 dark:bg-gray-750" />
            </div>
        </div>
    </div>
);

// ============================================================================
// MAIN MESSAGING PAGE
// ============================================================================

const MessagesPage = () => {
    const [selectedMessage, setSelectedMessage] = useState(null);

    const handleMessageSelect = useCallback((message) => {
        setSelectedMessage(message);
    }, []);

    const handleBackToList = useCallback(() => {
        setSelectedMessage(null);
    }, []);

    return (
        <>
            <PageMeta title="Messages | GCCC Ibadan" />
            <PageBreadcrumb icon={MessagesSquareIcon} pageTitle="Messages" description={'Your conversations'} />
            <ComponentCard>
                <div className="flex min-h-[calc(100vh-16rem)] flex-col">
                    {/* Sophisticated ambient background */}
                    <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-40 dark:opacity-20">
                        <div className="absolute -right-1/3 -top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-400/30 via-indigo-500/20 to-transparent blur-3xl" />
                        <div className="absolute -bottom-1/3 -left-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-violet-400/30 via-purple-500/20 to-transparent blur-3xl" />
                        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-pink-400/20 via-rose-500/10 to-transparent blur-3xl" />
                    </div>

                    {/* Main Content */}
                    <div className="relative flex flex-1 overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200/60 bg-white/40 shadow backdrop-blur-xl dark:border-gray-800/60 dark:bg-gray-900/40">
                        {/* Messages List */}
                        <div
                            className={`${selectedMessage ? 'hidden lg:block' : 'block'
                                } w-full border-r border-gray-200/60 bg-gradient-to-b from-gray-50/80 to-white/80 backdrop-blur-xl dark:border-gray-800/60 dark:from-gray-900/80 dark:to-gray-950/80 lg:w-[420px] xl:w-[480px]`}
                        >
                            <MessagesList
                                onSelectMessage={handleMessageSelect}
                                selectedMessageId={selectedMessage?.id}
                            />
                        </div>

                        {/* Message Detail / Reply */}
                        <main
                            className={`${selectedMessage ? 'block' : 'hidden lg:block'
                                } flex-1 bg-white/60 backdrop-blur-sm dark:bg-gray-900/60`}
                        >
                            {selectedMessage ? (
                                <MessageDetail message={selectedMessage} onBack={handleBackToList} />
                            ) : (
                                <EmptyState />
                            )}
                        </main>
                    </div>
                </div>
            </ComponentCard>
        </>
    );
};

// ============================================================================
// MESSAGES LIST
// ============================================================================

const MessagesList = ({ onSelectMessage, selectedMessageId }) => {
    const { data: messages = [], isLoading, isError, error } = useInboxMessages();

    const unreadCount = messages.filter(m => !m.is_read && m.is_recipient).length;
    const totalCount = messages.length;

    if (isLoading) {
        return (
            <div className="flex h-full flex-col">
                <div className="border-b border-gray-200/60 bg-white/60 px-4 sm:px-6 py-4 sm:py-5 backdrop-blur-xl dark:border-gray-800/60 dark:bg-gray-900/60">
                    <div className="flex items-center justify-between">
                        <div className="h-7 w-24 sm:h-8 sm:w-32 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
                        <div className="h-5 w-16 sm:h-6 sm:w-20 animate-pulse rounded-lg bg-gray-150 dark:bg-gray-750" />
                    </div>
                </div>
                <MessageListSkeleton />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-6 sm:p-8">
                <div className="text-center">
                    <div className="mx-auto mb-4 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-red-100 to-red-50 shadow dark:from-red-900/30 dark:to-red-950/30">
                        <Mail className="h-8 w-8 sm:h-10 sm:w-10 text-red-600 dark:text-red-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                        Failed to load messages
                    </h3>
                    <p className="mt-2 sm:mt-3 text-sm text-gray-600 dark:text-gray-400">
                        {error?.message || 'Please try refreshing the page'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            {/* Enhanced Header with Stats */}
            <div className="border-b border-gray-200/60 bg-gradient-to-r from-white/80 to-gray-50/80 px-4 sm:px-6 py-4 sm:py-5 backdrop-blur-xl dark:border-gray-800/60 dark:from-gray-900/80 dark:to-gray-950/80">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                                Inbox
                            </h2>
                            {unreadCount > 0 && (
                                <span className="flex h-6 sm:h-7 min-w-[24px] sm:min-w-[28px] items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-2 sm:px-2.5 text-xs font-bold text-white shadow ring-2 ring-blue-50 dark:ring-blue-950">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                            {totalCount === 0
                                ? 'No messages yet'
                                : unreadCount > 0
                                    ? `${unreadCount} new of ${totalCount} total`
                                    : `${totalCount} ${totalCount === 1 ? 'message' : 'messages'}`
                            }
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <div className="hidden sm:flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow">
                            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" strokeWidth={2} />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4">
                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center px-4">
                            <div className="mx-auto mb-4 sm:mb-6 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-gray-100 to-gray-50 shadow dark:from-gray-800 dark:to-gray-900">
                                <InboxIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-600" strokeWidth={1.5} />
                            </div>
                            <p className="text-sm sm:text-base font-semibold text-gray-600 dark:text-gray-400">
                                Your inbox is empty
                            </p>
                            <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-500">
                                New messages will appear here
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2 sm:space-y-2.5">
                        {messages.map((message, index) => (
                            <MessageListItem
                                key={message.id}
                                message={message}
                                isSelected={selectedMessageId === message.id}
                                onClick={() => onSelectMessage(message)}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// MESSAGE LIST ITEM - REFINED DESIGN
// ============================================================================

const MessageListItem = ({ message, isSelected, onClick, index }) => {
    const markAsReadMutation = useMarkAsRead();

    const handleClick = useCallback(() => {
        onClick();
        if (!message.is_read && message.is_recipient) {
            markAsReadMutation.mutate(message.id);
        }
    }, [onClick, message, markAsReadMutation]);

    const displayName = message.sender?.full_name || 'Unknown';
    const displayEmail = message.sender?.email || '';
    const initials = message.sender?.initials || displayName.charAt(0).toUpperCase();
    const isUnread = !message.is_read && message.is_recipient;

    return (
        <article
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
            style={{ animationDelay: `${index * 60}ms` }}
            className={`
                group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-500 animate-in fade-in slide-in-from-right-4
                ${isSelected
                    ? 'border-indigo-500/50 bg-gradient-to-br from-indigo-50 via-white to-blue-50/50 shadow ring-2 ring-indigo-500/20 dark:border-indigo-600/50 dark:from-indigo-950/40 dark:via-gray-800 dark:to-blue-950/40'
                    : isUnread
                        ? 'border-blue-200/80 bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/70 shadow hover:border-blue-300 hover:shadow dark:border-blue-900/60 dark:from-blue-950/50 dark:via-gray-800/80 dark:to-indigo-950/50 dark:hover:border-blue-800'
                        : 'border-gray-200/60 bg-gradient-to-br from-white/90 to-gray-50/50 shadow-sm hover:border-gray-300/80 hover:bg-white hover:shadow dark:border-gray-800/60 dark:from-gray-800/60 dark:to-gray-900/60 dark:hover:border-gray-700/80 dark:hover:from-gray-800/80 dark:hover:to-gray-900/80'
                }
            `}
        >
            {/* Unread Indicator */}
            {isUnread && (
                <>
                    <div className="absolute left-0 top-0 h-full w-1.5 rounded-r-full bg-gradient-to-b from-blue-600 via-indigo-600 to-blue-600 shadow" />
                    <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
                        <div className="relative">
                            <div className="absolute inset-0 animate-ping rounded-full bg-blue-500 opacity-75" />
                            <div className="relative h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 ring-2 ring-white dark:ring-gray-900" />
                        </div>
                    </div>
                </>
            )}

            <div className="flex gap-3 sm:gap-4 p-4 sm:p-5">
                {/* Avatar - No color wrapper */}
                <div className="relative shrink-0">
                    <Avatar
                        src={message.sender?.avatar}
                        name={initials}
                        size="md"
                        className="ring-2 ring-white dark:ring-gray-900"
                    />
                    {isUnread && (
                        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow ring-2 ring-white dark:ring-gray-900">
                            <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" strokeWidth={2.5} />
                        </div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    {/* Header with name and time */}
                    <div className="mb-2 sm:mb-2.5 flex items-start justify-between gap-2 sm:gap-3">
                        <div className="min-w-0 flex-1">
                            <h3 className={`truncate text-sm sm:text-base font-bold tracking-tight ${isUnread
                                    ? 'text-gray-900 dark:text-white'
                                    : 'text-gray-800 dark:text-gray-200'
                                }`}>
                                {displayName}
                            </h3>
                            <div className="mt-0.5 flex items-center gap-1.5 sm:gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <User className="h-3 w-3" strokeWidth={2} />
                                <span className="truncate">{displayEmail}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 sm:gap-1.5 shrink-0">
                            <time className={`flex items-center gap-1 sm:gap-1.5 rounded-lg px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs font-semibold ${isUnread
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                }`}>
                                <Clock className="h-3 w-3" strokeWidth={2} />
                                <span className="hidden sm:inline">{message.created_at_human || new Date(message.created_at).toLocaleDateString()}</span>
                                <span className="sm:hidden">{message.created_at_human?.split(' ')[0] || new Date(message.created_at).toLocaleDateString()}</span>
                            </time>
                        </div>
                    </div>

                    {/* Subject */}
                    <h4 className={`mb-1.5 sm:mb-2 truncate text-xs sm:text-sm font-bold ${isUnread
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                        {message.subject || 'No Subject'}
                    </h4>

                    {/* Body Preview */}
                    <p className={`line-clamp-2 text-xs sm:text-sm leading-relaxed ${isUnread
                            ? 'text-gray-700 dark:text-gray-300'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                        {message.body}
                    </p>

                    {/* Footer with metadata */}
                    <div className="mt-2 sm:mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            {message.is_read ? (
                                <div className="flex items-center gap-1 sm:gap-1.5 rounded-lg bg-green-100 px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs font-semibold text-green-700 dark:bg-green-950/50 dark:text-green-300">
                                    <CheckCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2} />
                                    <span>Read</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 sm:gap-1.5 rounded-lg bg-blue-100 px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                                    <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2} />
                                    <span>New</span>
                                </div>
                            )}
                            {message.read_at_human && message.is_read && (
                                <span className="hidden sm:inline text-xs text-gray-500 dark:text-gray-500">
                                    {message.read_at_human}
                                </span>
                            )}
                        </div>
                        {message.is_sender && message.is_recipient && (
                            <span className="rounded-lg bg-amber-100 px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                                Self
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5"
                    style={{
                        transform: 'translateX(-100%)',
                        animation: 'shimmer 2s infinite'
                    }}
                />
            </div>
        </article>
    );
};

// ============================================================================
// MESSAGE DETAIL WITH REPLY - COMPACT LAYOUT & FIXED REPLY BOX
// ============================================================================

const MessageDetail = ({ message, onBack }) => {
    const replyMutation = useReplyToMessage();
    const [replyText, setReplyText] = useState('');
    const [showReplyForm, setShowReplyForm] = useState(false);

    const handleSendReply = useCallback(
        (e) => {
            e.preventDefault();
            if (!replyText.trim()) return;

            replyMutation.mutate(
                {
                    messageId: message.id,
                    body: replyText,
                },
                {
                    onSuccess: () => {
                        setReplyText('');
                        setShowReplyForm(false);
                    },
                }
            );
        },
        [replyText, message.id, replyMutation]
    );

    const displayName = message.sender?.full_name || 'Unknown';
    const displayEmail = message.sender?.email || '';
    const initials = message.sender?.initials || displayName.charAt(0).toUpperCase();

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="border-b border-gray-200/60 bg-gradient-to-r from-white/90 to-gray-50/90 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 backdrop-blur-xl dark:border-gray-800/60 dark:from-gray-900/90 dark:to-gray-950/90">
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                    <button
                        onClick={onBack}
                        className="group flex h-10 sm:h-11 items-center gap-2 sm:gap-2.5 rounded-xl sm:rounded-2xl border border-gray-300/80 bg-white px-3 sm:px-5 text-sm font-bold text-gray-800 shadow transition-all hover:border-gray-400 hover:bg-gray-50 hover:shadow active:scale-95 dark:border-gray-600/80 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-500 dark:hover:bg-gray-700"
                    >
                        <ChevronLeft className="h-4 w-4 sm:h-4.5 sm:w-4.5 transition-transform group-hover:-translate-x-0.5" strokeWidth={2.5} />
                        <span className="hidden sm:inline">Back</span>
                    </button>

                    <Button
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        startIcon={<Send className="h-4 w-4" strokeWidth={2.5} />}
                        className="h-10 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 text-sm font-bold shadow transition-all hover:shadow active:scale-95"
                    >
                        {showReplyForm ? 'Hide' : 'Reply'}
                    </Button>
                </div>
            </div>

            {/* Message Content - Compact Layout */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 lg:p-8 xl:p-10">
                    {/* Sender Info - Compact */}
                    <div className="mb-6 sm:mb-8 flex items-start gap-4 sm:gap-6">
                        <div className="relative shrink-0">
                            <Avatar
                                src={message.sender?.avatar}
                                name={initials}
                                size="lg"
                                className="ring-4 ring-white shadow dark:ring-gray-900"
                            />
                            {message.sender?.gender && (
                                <div className="absolute -bottom-2 -right-2 rounded-xl bg-white px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-bold text-gray-700 shadow ring-2 ring-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
                                    {message.sender.gender}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {displayName}
                            </h2>
                            <p className="mt-1 sm:mt-2 flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                <Mail className="h-4 w-4 shrink-0" strokeWidth={2} />
                                <span className="truncate">{displayEmail}</span>
                            </p>
                            <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                <div className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-blue-100 px-2.5 sm:px-3.5 py-1 sm:py-1.5 font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" strokeWidth={2} />
                                    <span className="truncate">{message.created_at_human || new Date(message.created_at).toLocaleString()}</span>
                                </div>
                                {message.read_at_human && (
                                    <div className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-green-100 px-2.5 sm:px-3.5 py-1 sm:py-1.5 font-semibold text-green-700 dark:bg-green-950/50 dark:text-green-300">
                                        <CheckCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" strokeWidth={2} />
                                        <span className="truncate">{message.read_at_human}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Subject & Body - Combined */}
                    <div className="rounded-2xl sm:rounded-3xl border border-gray-200/60 bg-white/60 p-6 sm:p-8 lg:p-10 shadow backdrop-blur-sm dark:border-gray-800/60 dark:bg-gray-900/60">
                        {message.subject && (
                            <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {message.subject}
                            </h1>
                        )}
                        <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none break-words dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400">
                            <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                                {message.body}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Reply Form - Fixed at bottom when open */}
                {showReplyForm && (
                    <div className="sticky bottom-0 border-t border-gray-200/60 bg-white/95 backdrop-blur-xl dark:border-gray-800/60 dark:bg-gray-900/95 shadow">
                        <form onSubmit={handleSendReply} className="p-4 sm:p-6 lg:p-8">
                            <div className="mb-4">
                                <label
                                    htmlFor="reply-body"
                                    className="mb-2 block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100"
                                >
                                    Reply to {displayName}
                                </label>
                                <textarea
                                    id="reply-body"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    required
                                    rows={4}
                                    placeholder="Type your reply..."
                                    className="w-full resize-none rounded-xl sm:rounded-2xl border border-gray-300 bg-white px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base leading-relaxed text-gray-900 shadow transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
                                />
                            </div>

                            <div className="flex justify-end gap-3 sm:gap-4">
                                <Button
                                    variant="outline-light"
                                    onClick={() => setShowReplyForm(false)}
                                    type="button"
                                    className="h-10 sm:h-12 rounded-xl sm:rounded-2xl border-2 px-4 sm:px-6 text-sm font-bold"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    loading={replyMutation.isPending}
                                    disabled={!replyText.trim()}
                                    startIcon={<Send className="h-4 w-4" strokeWidth={2.5} />}
                                    className="h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 sm:px-8 text-sm font-bold shadow transition-all hover:shadow active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Send
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// EMPTY STATE
// ============================================================================

const EmptyState = () => {
    return (
        <div className="flex h-full items-center justify-center p-6 sm:p-8 lg:p-10">
            <div className="text-center">
                <div className="mx-auto mb-6 sm:mb-8 flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-3xl sm:rounded-[2rem] bg-gradient-to-br from-gray-100 via-gray-50 to-white shadow ring-1 ring-gray-200/50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 dark:ring-gray-800/50">
                    <Mail className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    Select a message to read
                </h3>
                <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Choose a conversation from your inbox to view details and reply
                </p>
            </div>
        </div>
    );
};

// ============================================================================
// GLOBAL ANIMATIONS
// ============================================================================

const style = document.createElement('style');
style.textContent = `
    @keyframes shimmer {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

export default MessagesPage;
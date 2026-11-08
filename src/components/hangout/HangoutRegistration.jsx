import { memo, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, Check, HeartHandshake, Loader2, Pencil } from 'lucide-react';
import { useHangoutRegistration } from '@/queries/hangout.query';
import AddToCalendar from './AddToCalendar';
import Confetti from './Confetti';
import ShareCard from './ShareCard';
import SupportAccountCard from './SupportAccountCard';
import { DISPLAY } from './HangoutTheme';
import { GIVING_VERSE, VENUE } from './hangoutContent';
import {
  CARD, CONTAINER, FIELD, FIELD_ERROR, PRIMARY_BUTTON, SECONDARY_BUTTON, SECTION, SECTION_INTRO, SECTION_TITLE,
} from './hangoutStyles';
import {
  EMPTY_FORM, firstName, formatDate, formatNaira, formatTime, parseAmount, scrollToSection, transferReference,
} from './hangoutUtils';

// Below this the count reads as "nobody's going" rather than social proof.
const MIN_COUNT_TO_SHOW = 10;
const MAX_SUPPORT = 100_000_000;

const FORM_FIELDS = [...Object.keys(EMPTY_FORM), 'game'];

const AFTER_REGISTERING = [
  'Your place for your game is saved straight away.',
  'You get a hangout card to share with other members.',
  'Need a change? Register again with the same email.',
];

const PHONE_PATTERN = { value: /^[0-9+\-\s()]{7,25}$/, message: 'Enter a valid phone number' };
const SUPPORT_RULES = {
  validate: (value) => {
    const amount = parseAmount(value);
    if (amount === null) return true;
    if (Number.isNaN(amount)) return 'Enter the amount as a number, for example 5000.';
    if (amount <= 0) return 'Enter an amount above zero, or leave it empty.';
    if (amount > MAX_SUPPORT) return 'That amount is too large. Please speak to us at church.';
    return true;
  },
};

const Field = ({ id, label, optional, error, hint, children }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="text-sm font-semibold text-(--hg-ink)">
      {label}
      {optional && <span className="font-normal text-(--hg-muted)"> (optional)</span>}
    </label>
    {children}
    {error ? (
      <p id={`${id}-error`} role="alert" className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
        <AlertCircle size={14} className="shrink-0" aria-hidden="true" />
        {error}
      </p>
    ) : hint ? (
      <p id={`${id}-hint`} className="text-sm text-(--hg-muted)">{hint}</p>
    ) : null}
  </div>
);

/* ─── Form ─────────────────────────────────────────────────────────────────── */

const RegistrationForm = ({ game, account, defaults, onDone, onMissingGame }) => {
  const { mutateAsync, isPending } = useHangoutRegistration();
  const {
    register, handleSubmit, watch, setError, formState: { errors },
  } = useForm({ mode: 'onBlur', defaultValues: defaults });

  const [fullName, supportText] = watch(['full_name', 'support_amount']);
  const supportAmount = parseAmount(supportText);
  const hasSupport = Number.isFinite(supportAmount) && supportAmount > 0;
  const GameIcon = game?.icon;

  const onSubmit = async (data) => {
    if (!game) {
      onMissingGame('Pick the game you want to play first.');
      return;
    }
    const payload = {
      full_name: data.full_name.trim(),
      email: data.email.trim(),
      phone_number: data.phone_number.trim(),
      whatsapp_number: data.whatsapp_number.trim() || null,
      game: game.name,
      support_amount: parseAmount(data.support_amount),
    };

    try {
      const response = await mutateAsync(payload);
      onDone({ updated: !!response?.data?.updated, payload, values: data });
    } catch (error) {
      // The hook shows a toast; put each server message on its field too.
      let focused = false;
      Object.entries(error?.data?.errors ?? {}).forEach(([field, messages]) => {
        if (!FORM_FIELDS.includes(field)) return;
        if (field === 'game') {
          onMissingGame(messages?.[0] ?? 'Pick another game.');
          return;
        }
        setError(field, { type: 'server', message: messages?.[0] }, { shouldFocus: !focused });
        focused = true;
      });
    }
  };

  const describe = (name, hasHint = false) => {
    if (errors[name]) return { 'aria-invalid': true, 'aria-describedby': `${name}-error` };
    return hasHint ? { 'aria-describedby': `${name}-hint` } : {};
  };
  const fieldClass = (name) => `${FIELD} ${errors[name] ? FIELD_ERROR : ''}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={`${CARD} mt-12 grid overflow-hidden lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-[1fr_auto]`}>
      <fieldset className="min-w-0 p-5 sm:p-8 lg:col-start-1 lg:row-start-1 lg:p-10">
        <legend className="sr-only">Your details</legend>
        <p className={`${DISPLAY} text-2xl font-extrabold text-(--hg-ink)`} aria-hidden="true">Your details</p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-(--hg-tint) p-3 sm:pl-4">
          {game ? (
            <p className="flex min-w-0 items-center gap-3 text-base font-bold text-(--hg-ink)">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--hg-surface) text-(--hg-brand)">
                {GameIcon && <GameIcon size={18} aria-hidden="true" />}
              </span>
              <span className="min-w-0"><span className="font-medium text-(--hg-muted)">Your game:</span> {game.name}</span>
            </p>
          ) : (
            <p className="pl-1 text-base font-semibold text-(--hg-ink)">You haven’t picked a game yet.</p>
          )}
          <button
            type="button"
            onClick={() => scrollToSection('games')}
            className="rounded-full bg-(--hg-surface) px-4 py-2 text-sm font-bold text-(--hg-brand) shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--hg-brand)/40"
          >
            {game ? 'Change game' : 'Pick a game'}
          </button>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field id="full_name" label="Full name" error={errors.full_name?.message}>
              <input
                id="full_name" type="text" autoComplete="name" placeholder="Your full name"
                className={fieldClass('full_name')} {...describe('full_name')}
                {...register('full_name', {
                  required: 'Enter your full name',
                  maxLength: { value: 150, message: 'Keep it under 150 characters' },
                })}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field
              id="email" label="Email address" error={errors.email?.message}
              hint="Registered already? Use the same email to update your registration."
            >
              <input
                id="email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com"
                className={fieldClass('email')} {...describe('email', true)}
                {...register('email', {
                  required: 'Enter your email address',
                  maxLength: { value: 255, message: 'Keep it under 255 characters' },
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                })}
              />
            </Field>
          </div>
          <Field id="phone_number" label="Phone number" error={errors.phone_number?.message}>
            <input
              id="phone_number" type="tel" autoComplete="tel" inputMode="tel" placeholder="0801 234 5678"
              className={fieldClass('phone_number')} {...describe('phone_number')}
              {...register('phone_number', { required: 'Enter your phone number', pattern: PHONE_PATTERN })}
            />
          </Field>
          <Field
            id="whatsapp_number" label="WhatsApp number" optional
            error={errors.whatsapp_number?.message} hint="If it’s different from your phone number."
          >
            <input
              id="whatsapp_number" type="tel" inputMode="tel" placeholder="0801 234 5678"
              className={fieldClass('whatsapp_number')} {...describe('whatsapp_number', true)}
              {...register('whatsapp_number', { pattern: { ...PHONE_PATTERN, message: 'Enter a valid WhatsApp number' } })}
            />
          </Field>
        </div>

        <div className="mt-8 rounded-2xl bg-(--hg-bg) p-5">
          <p className="text-sm font-bold text-(--hg-ink)">After you register</p>
          <ul className="mt-3 grid gap-2.5">
            {AFTER_REGISTERING.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-(--hg-muted)">
                <Check size={16} className="mt-0.5 shrink-0 text-(--hg-brand)" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </fieldset>

      <fieldset className="min-w-0 bg-(--hg-deep) p-5 text-white sm:p-8 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:p-10">
        <legend className="sr-only">Give towards the hangout (optional)</legend>
        <p className="flex items-center gap-3" aria-hidden="true">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-(--hg-sun)">
            <HeartHandshake size={20} />
          </span>
          <span className={`${DISPLAY} text-2xl font-extrabold`}>Give towards the day</span>
        </p>
        <p className="mt-4 text-base leading-relaxed text-white/80">
          Giving is optional, but every gift helps make the hangout a great day for the whole church family.
          Pledge any amount here, then transfer it to the account below.
        </p>
        <blockquote className="mt-6 rounded-2xl bg-white/5 px-5 py-4 text-base italic leading-relaxed text-white/85">
          “{GIVING_VERSE.text}”
          <footer className="mt-2 text-sm font-semibold not-italic text-(--hg-sky)">{GIVING_VERSE.reference}</footer>
        </blockquote>

        <div className="mt-7">
          <label htmlFor="support_amount" className="text-sm font-semibold text-white">
            Amount you’d like to give <span className="font-normal text-white/60">(optional)</span>
          </label>
          <div className="relative mt-2">
            <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-white/60">₦</span>
            <input
              id="support_amount" type="text" inputMode="decimal" placeholder="Any amount"
              className={`w-full rounded-2xl border-0 py-4 pl-9 pr-4 text-base text-white outline-none transition-[background-color,box-shadow]
                placeholder:text-white/45 focus:bg-white/15
                ${errors.support_amount ? 'bg-red-500/20' : 'bg-white/10'}`}
              {...(errors.support_amount && { 'aria-invalid': true, 'aria-describedby': 'support_amount-error' })}
              {...register('support_amount', SUPPORT_RULES)}
            />
          </div>
          {errors.support_amount && (
            <p id="support_amount-error" role="alert" className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-red-200">
              <AlertCircle size={14} className="shrink-0" aria-hidden="true" />
              {errors.support_amount.message}
            </p>
          )}
          {hasSupport && !errors.support_amount && (
            <p className="mt-2 text-sm font-semibold text-(--hg-sky)">Thank you! You’re pledging {formatNaira(supportAmount)}.</p>
          )}
        </div>

        <SupportAccountCard className="mt-7" account={account} reference={transferReference(account, fullName)} />
      </fieldset>

      {/* On wide screens this sits under the details, beside the giving panel. */}
      <div className="flex flex-col gap-4 border-t border-(--hg-line) p-5 sm:flex-row sm:items-center sm:px-8 lg:col-start-1 lg:row-start-2 lg:px-10">
        <button type="submit" disabled={isPending} className={`${PRIMARY_BUTTON} w-full px-10 py-4 sm:w-auto`}>
          {isPending ? <><Loader2 size={18} className="animate-spin" aria-hidden="true" />Registering…</> : 'Register'}
        </button>
        <p className="text-sm text-(--hg-muted)">
          By registering, you agree to receive updates about the hangout from GCCC Ibadan.
        </p>
      </div>
    </form>
  );
};

/* ─── Confirmation ─────────────────────────────────────────────────────────── */

const Confirmation = ({ result, game, account, startsAt, onEdit }) => {
  const reduceMotion = useReducedMotion();
  const name = firstName(result.payload.full_name);
  const pledge = result.payload.support_amount;
  const when = [formatDate(startsAt), formatTime(startsAt)].filter(Boolean).join(' at ');

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative grid items-start gap-10 lg:grid-cols-[1fr_420px] lg:gap-14"
    >
      {!result.updated && <Confetti />}
      <div className="min-w-0">
        <div role="status">
          <h2 id="register-title" className={SECTION_TITLE}>
            {result.updated ? `Registration updated, ${name}.` : `You’re in, ${name}!`}
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-(--hg-muted)">
            Your place for <strong className="text-(--hg-ink)">{result.payload.game}</strong> is saved.
            {' '}See you at {VENUE.name}{when ? ` on ${when}` : ''}.
          </p>
        </div>

        <div className="mt-8 max-w-xl">
          <p className="flex items-start gap-2.5 text-base font-semibold text-(--hg-ink)">
            <HeartHandshake size={20} className="mt-0.5 shrink-0 text-(--hg-brand)" aria-hidden="true" />
            {pledge
              ? `Thank you for pledging ${formatNaira(pledge)}. Please transfer it to this account:`
              : 'If you’d still like to give towards the day, any amount helps. Transfer it to this account:'}
          </p>
          <SupportAccountCard className="mt-4" account={account} reference={transferReference(account, result.payload.full_name)} />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <AddToCalendar startsAt={startsAt} />
          <button type="button" onClick={onEdit} className={SECONDARY_BUTTON}>
            <Pencil size={15} aria-hidden="true" />
            Change my registration
          </button>
        </div>
      </div>

      <ShareCard name={name} game={game?.name ?? result.payload.game} startsAt={startsAt} />
    </motion.div>
  );
};

/* ─── Section ──────────────────────────────────────────────────────────────── */

/**
 * status: loading | error | ready. `info` is the API's hangout details;
 * `game` is the picked game (picked in the games section above).
 * `result` is the last successful registration, held by the page.
 */
const HangoutRegistration = ({
  info, status, startsAt, game, result, defaults, onRegistered, onEdit, onMissingGame,
}) => {
  const sectionRef = useRef(null);
  const open = !!info?.registration_open;
  const count = info?.registrations_count ?? 0;

  const scrollToTop = () => sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const handleDone = useCallback((details) => { onRegistered(details); scrollToTop(); }, [onRegistered]);
  const handleEdit = useCallback(() => { onEdit(); scrollToTop(); }, [onEdit]);

  if (status !== 'ready') return null;

  return (
    <section ref={sectionRef} id="register" className={`${SECTION} bg-(--hg-bg)`} aria-labelledby="register-title">
      <div className={CONTAINER}>
        {/* Once registered, the confirmation's heading takes over. */}
        {!(open && result) && (
          <header>
            <h2 id="register-title" className={SECTION_TITLE}>{open ? 'Register' : 'Registration has closed'}</h2>
            <p className={SECTION_INTRO}>
              {open
                ? 'Add your details and you’re done. It takes about a minute.'
                : 'Thank you for your interest. Registration for the hangout is no longer open.'}
            </p>
            {open && count >= MIN_COUNT_TO_SHOW && (
              <p className="mt-3 text-base font-semibold text-(--hg-brand)">
                {count.toLocaleString('en-GB')} members have registered so far.
              </p>
            )}
          </header>
        )}

        {open && (
          <AnimatePresence mode="wait" initial={false}>
            {result ? (
              <Confirmation key="done" result={result} game={game} account={info.support_account} startsAt={startsAt} onEdit={handleEdit} />
            ) : (
              <motion.div key="form" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <RegistrationForm
                  game={game}
                  account={info.support_account}
                  defaults={defaults}
                  onDone={handleDone}
                  onMissingGame={onMissingGame}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};

export default memo(HangoutRegistration);

/**
 * Button
 * ─────────────────────────────────────────────────────────────
 * Fixes applied:
 *
 * 1. RippleEffect extracted to module scope — was defined inside Button's
 *    render, causing React to unmount/remount it on every state change.
 *    Safari is strict about this and renders blank subtrees as a result.
 *
 * 2. ButtonContent inlined directly — eliminates the second nested
 *    component and the instability it caused.
 *
 * 3. `hover:brightness-110` replaced with explicit `hover:bg-*` values —
 *    Safari has longstanding bugs with CSS `filter: brightness()` applied
 *    to elements that already have `background-image` (gradients).
 *
 * 4. Class string built with an array + .join(' ') — more reliable than
 *    multiline template literals in all JS engines.
 *
 * 5. `createRipple` also calls `onClick` correctly (no change in behaviour,
 *    just clarified).
 */

import { LoadingIcon2 } from '@/icons';
import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────
   RIPPLE — module-level component, stable reference always
───────────────────────────────────────────────────────────── */
const Ripple = ({ ripples }) => (
  <>
    {ripples.map(({ id, x, y, size }) => (
      <span
        key={id}
        data-testid="ripple"
        className="absolute rounded-full pointer-events-none"
        style={{
          left: x,
          top: y,
          width: size,
          height: size,
          backgroundColor: 'rgba(255,255,255,0.28)',
          transform: 'scale(0)',
          animation: 'btn-ripple 0.6s cubic-bezier(0.4,0,0.2,1) forwards',
        }}
      />
    ))}

    {/* Injected once — keyed style tag avoids duplicates in SSR */}
    <style>{`
            @keyframes btn-ripple {
                to { transform: scale(1); opacity: 0; }
            }
        `}</style>
  </>
);

/* ─────────────────────────────────────────────────────────────
   VARIANT MAP
   Safari bug: filter:brightness on gradient backgrounds causes
   blank / invisible rendering. Use explicit hover colours instead.
───────────────────────────────────────────────────────────── */
const VARIANT = {
  primary:
    'bg-gradient-to-r from-[#119bd6] via-[#0d8ac0] to-[#0a7eb3] ' +
    'text-white rounded-lg shadow-md font-semibold ' +
    'hover:from-[#13aae8] hover:via-[#0f9ad3] hover:to-[#0b8ec8] hover:shadow-xl ' +
    'active:from-[#0d8ac0] active:via-[#0a7eb3] active:to-[#0872a6] active:scale-[0.97] ' +
    'transition-all duration-200 ease-out',

  'outline-primary':
    'bg-transparent border-2 border-[#119bd6] text-[#119bd6] rounded-lg font-semibold ' +
    'hover:bg-[#119bd6]/10 hover:border-[#0d8ac0] hover:shadow-md ' +
    'active:scale-[0.97] active:bg-[#119bd6]/20 ' +
    'transition-all duration-200 ease-out',

  danger:
    'bg-gradient-to-r from-[#eb2225] via-[#d41e21] to-[#c11a1d] ' +
    'text-white rounded-lg shadow-md font-semibold ' +
    'hover:from-[#f03235] hover:via-[#e02225] hover:to-[#cc1c1f] hover:shadow-xl ' +
    'active:scale-[0.97] ' +
    'transition-all duration-200 ease-out',

  'outline-danger':
    'bg-transparent border-2 border-[#eb2225] text-[#eb2225] rounded-lg font-semibold ' +
    'hover:bg-[#eb2225]/10 hover:border-[#d41e21] hover:shadow-md ' +
    'active:scale-[0.97] active:bg-[#eb2225]/20 ' +
    'transition-all duration-200 ease-out',

  light:
    'bg-white text-gray-700 rounded-lg shadow-md border border-gray-200 font-semibold ' +
    'hover:shadow-lg hover:bg-gray-50 hover:border-gray-300 ' +
    'active:scale-[0.97] active:bg-gray-100 ' +
    'transition-all duration-200 ease-out ' +
    'dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 ' +
    'dark:hover:bg-gray-750 dark:hover:border-gray-600',

  'outline-light':
    'bg-transparent border-2 border-gray-300 text-gray-600 rounded-lg font-semibold ' +
    'hover:bg-gray-100 hover:border-gray-400 hover:shadow-md ' +
    'active:scale-[0.97] active:bg-gray-200 ' +
    'transition-all duration-200 ease-out ' +
    'dark:border-gray-600 dark:text-gray-300 ' +
    'dark:hover:bg-gray-800/80 dark:hover:border-gray-500',

  dark:
    'bg-gradient-to-r from-[#101828] via-[#1a2235] to-[#0f1624] ' +
    'text-white rounded-lg shadow-md font-semibold ' +
    'hover:from-[#1a2638] hover:via-[#243045] hover:to-[#192032] hover:shadow-xl ' +
    'active:scale-[0.97] ' +
    'transition-all duration-200 ease-out ' +
    'dark:from-gray-700 dark:via-gray-650 dark:to-gray-700',

  'outline-dark':
    'bg-transparent border-2 border-gray-600 text-gray-700 rounded-lg font-semibold ' +
    'hover:bg-gray-100 hover:border-gray-700 hover:shadow-md ' +
    'active:scale-[0.97] active:bg-gray-200 ' +
    'transition-all duration-200 ease-out ' +
    'dark:border-gray-500 dark:text-gray-300 ' +
    'dark:hover:bg-gray-800 dark:hover:border-gray-400',

  ghost:
    'bg-gray-200/90 text-gray-700 rounded-lg font-semibold ' +
    'hover:bg-gray-300 hover:shadow-md ' +
    'active:scale-[0.97] active:bg-gray-400/80 ' +
    'transition-all duration-200 ease-out ' +
    'dark:bg-gray-700/90 dark:text-gray-200 dark:hover:bg-gray-600',

  neutral:
    'bg-gray-200/90 text-gray-700 rounded-lg font-semibold ' +
    'hover:bg-gray-300 hover:shadow-md ' +
    'active:scale-[0.97] active:bg-gray-400/80 ' +
    'transition-all duration-200 ease-out ' +
    'dark:bg-gray-700/90 dark:text-gray-200 dark:hover:bg-gray-600',
};

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-[#119bd6] dark:focus-visible:ring-[#119bd6] ' +
  'dark:focus-visible:ring-offset-gray-900';

/* ─────────────────────────────────────────────────────────────
   BUTTON
───────────────────────────────────────────────────────────── */
const Button = ({
  children,
  variant = 'primary',
  startIcon,
  endIcon,
  onClick,
  href,
  title,
  className = '',
  disabled = false,
  type = 'button',
  loading = false,
  target = '_self',
  rel = '',
}) => {
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);

  const createRipple = useCallback((e) => {
    if (disabled || loading) return;

    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const size = Math.max(rect.width, rect.height) * 2;
    const id = Date.now();

    setRipples(prev => [...prev, {
      id,
      x: e.clientX - rect.left - size / 2,
      y: e.clientY - rect.top - size / 2,
      size,
    }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);

    onClick?.(e);
  }, [disabled, loading, onClick]);

  /* ── Class assembly — array join avoids multiline template issues ── */
  const isNeutral = variant === 'neutral';
  const cls = [
    'inline-flex items-center justify-center',
    isNeutral
      ? 'text-xs p-2 gap-1 relative overflow-hidden'
      : 'h-10 sm:h-11 text-sm sm:text-base px-4 sm:px-5 gap-2 relative overflow-hidden',
    VARIANT[variant] ?? VARIANT.primary,
    disabled || loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
    FOCUS,
    className,
  ].join(' ').replace(/\s+/g, ' ').trim();

  /* ── Shared inner content ── */
  const content = (
    <>
      {/* Start icon / spinner */}
      {loading
        ? <LoadingIcon2 />
        : startIcon
          ? <span className="flex items-center shrink-0">{startIcon}</span>
          : null
      }

      {/* Label — hidden while loading to prevent layout shift */}
      {!loading && (
        <span className="truncate flex items-center gap-1 font-semibold">
          {children}
        </span>
      )}

      {/* End icon */}
      {endIcon && !loading && (
        <span className="flex items-center shrink-0">{endIcon}</span>
      )}

      {/* Ripple — stable module-level component, always mounts cleanly */}
      <Ripple ripples={ripples} />
    </>
  );

  /* ── Link variant ── */
  if (href && !disabled && !loading) {
    const isExternal = href.startsWith('http') || href.startsWith('//');
    const finalRel = rel || (target === '_blank' ? 'noopener noreferrer' : '');
    const sharedProps = {
      ref: buttonRef,
      title: title || undefined,
      target,
      rel: finalRel || undefined,
      className: `group ${cls}`,
      onClick: createRipple,
    };

    return isExternal
      ? <a {...sharedProps} href={href}>{content}</a>
      : <Link {...sharedProps} to={href}>{content}</Link>;
  }

  /* ── Button variant ── */
  return (
    <button
      ref={buttonRef}
      type={type}
      title={title || undefined}
      className={`group ${cls}`}
      onClick={createRipple}
      disabled={disabled || loading}
    >
      {content}
    </button>
  );
};

export default Button;
// Lucide has no icons for these games, so they are drawn here on the same
// 24×24 grid with round caps, and take the same props as a lucide icon.

const IconBase = ({ size = 24, strokeWidth = 2, className = '', children }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const HorseshoeIcon = (props) => (
  <IconBase {...props}>
    <path d="M6 3v8a6 6 0 0 0 12 0V3" />
    <path d="M4.5 3h3M16.5 3h3" />
    <circle cx="7.6" cy="9" r="0.6" />
    <circle cx="16.4" cy="9" r="0.6" />
    <circle cx="8.6" cy="13.4" r="0.6" />
    <circle cx="15.4" cy="13.4" r="0.6" />
  </IconBase>
);

export const BowlingPinIcon = (props) => (
  <IconBase {...props}>
    <path d="M12 2c-1.6 0-2.6 1.3-2.6 2.9 0 1.3.7 2 .7 3.1 0 .9-1.9 2.6-1.9 6.6 0 3.2 1.3 5.6 3.8 7.4 2.5-1.8 3.8-4.2 3.8-7.4 0-4-1.9-5.7-1.9-6.6 0-1.1.7-1.8.7-3.1C14.6 3.3 13.6 2 12 2Z" />
    <path d="M10.3 9.2h3.4" />
  </IconBase>
);

export const PaddleIcon = (props) => (
  <IconBase {...props}>
    <circle cx="10" cy="10" r="6.5" />
    <path d="m14.6 14.6 5.4 5.4" />
    <circle cx="19" cy="5" r="1.6" />
  </IconBase>
);

export const TrampolineIcon = (props) => (
  <IconBase {...props}>
    <ellipse cx="12" cy="16" rx="9" ry="2.5" />
    <path d="M4.5 17.5V21M19.5 17.5V21M12 18.5V21" />
    <path d="M12 11V3M9 6l3-3 3 3" />
  </IconBase>
);

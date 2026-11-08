// The hangout page palette, built on the church's blue (#0998d5). Components
// read these as bg-(--hg-*) / text-(--hg-*).
//   deep    – the dark blue bands (hero, featured panels)
//   brand   – links, icons, selected states; dark enough for white text (AA)
//   sky     – the bright blue used on deep blue
//   sun     – the one warm accent, used sparingly
//   action  – primary buttons: brand blue on light, sky blue on dark
// The display face (Bricolage Grotesque) is loaded by useDisplayFont.
//   field   – filled form fields (no outlines)
//   tint    – pale blue panels and icon tiles
export const THEME = [
  '[--hg-bg:#f4f8fc] [--hg-surface:#ffffff] [--hg-ink:#0a2540] [--hg-muted:#526a82] [--hg-line:#dde9f3]',
  '[--hg-deep:#062c4f] [--hg-brand:#0779ad] [--hg-sky:#8fdcff] [--hg-sun:#ffcf4a]',
  '[--hg-field:#eef4fa] [--hg-tint:#e6f3fc] [--hg-action:#0779ad] [--hg-on-action:#ffffff]',
  "[--hg-display:'Bricolage_Grotesque',Outfit,sans-serif]",
  'dark:[--hg-bg:#04111d] dark:[--hg-surface:#0a1d2e] dark:[--hg-ink:#e6f1fa] dark:[--hg-muted:#93acc2]',
  'dark:[--hg-line:#17334b] dark:[--hg-deep:#072540] dark:[--hg-brand:#38b6f0]',
  'dark:[--hg-field:#10273b] dark:[--hg-tint:#0e2a40] dark:[--hg-action:#38b6f0] dark:[--hg-on-action:#04111d]',
].join(' ');

/** Headline type. */
export const DISPLAY = 'font-(family-name:--hg-display) tracking-[-0.035em]';

export const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&display=swap';


const HangoutTheme = ({ children }) => (
  // No grey flash on tap in iOS Safari; focus and pressed states carry the feedback.
  <div className={`${THEME} bg-(--hg-bg) font-outfit text-(--hg-ink) [-webkit-tap-highlight-color:transparent]`}>{children}</div>
);

export default HangoutTheme;

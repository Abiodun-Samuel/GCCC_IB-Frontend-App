import { memo } from 'react';
import { MapPin } from 'lucide-react';
import HangoutPhoto from './HangoutPhoto';
import PhotoCredit from './PhotoCredit';
import VideoEmbed from './VideoEmbed';
import { DISPLAY } from './HangoutTheme';
import { AGODI, PARK_FEATURES, VENUE } from './hangoutContent';
import { CONTAINER, SECTION, SECTION_TITLE } from './hangoutStyles';
import { scrollToSection } from './hangoutUtils';

/**
 * About the venue, right after the hero: what it is beside a photo of the
 * gardens, then the aerial video next to what there is to see.
 */
const AboutAgodi = () => (
  <section id="agodi" className={`${SECTION} bg-(--hg-bg)`} aria-labelledby="agodi-title">
    <div className={CONTAINER}>
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <h2 id="agodi-title" className={SECTION_TITLE}>About Agodi Gardens</h2>
          {AGODI.about.map((paragraph) => (
            <p key={paragraph} className="mt-5 max-w-xl text-lg leading-relaxed text-(--hg-muted)">{paragraph}</p>
          ))}
          <button
            type="button"
            onClick={() => scrollToSection('venue')}
            className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-(--hg-surface) py-3 pl-3 pr-5 text-left transition hover:bg-(--hg-tint) focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--hg-brand)/40"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--hg-tint) text-(--hg-brand)">
              <MapPin size={18} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base font-bold text-(--hg-ink)">{VENUE.area}</span>
              <span className="block text-sm text-(--hg-brand)">See how to get there</span>
            </span>
          </button>
        </div>

        <figure className="lg:col-span-7">
          <div className="overflow-hidden rounded-3xl bg-(--hg-line)">
            <HangoutPhoto photo={AGODI.photo} sizes="(max-width: 1023px) 92vw, 56vw" />
          </div>
          <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-1 text-sm text-(--hg-muted)">
            <span className="font-semibold text-(--hg-ink)">The name sign at Agodi Gardens</span>
            <PhotoCredit credit={AGODI.photo.credit} />
          </figcaption>
        </figure>
      </div>

      <div className="mt-16 grid items-center gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-14">
        <VideoEmbed video={AGODI.video} className="lg:col-span-7" captionClassName="px-1" />

        <div className="lg:col-span-5">
          <h3 className={`${DISPLAY} text-2xl font-extrabold text-(--hg-ink) sm:text-3xl`}>Around the gardens</h3>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {PARK_FEATURES.map(({ title, description, icon: Icon, photo }) => (
              <li key={title} className="flex items-center gap-4">
                <div className="w-28 shrink-0 overflow-hidden rounded-xl bg-(--hg-line) sm:w-32">
                  <HangoutPhoto photo={photo} Icon={Icon} sizes="128px" decorative />
                </div>
                <div className="min-w-0">
                  <h4 className="flex items-center gap-2 text-base font-bold text-(--hg-ink)">
                    <Icon size={16} className="shrink-0 text-(--hg-brand)" aria-hidden="true" />
                    {title}
                  </h4>
                  <p className="mt-0.5 text-sm leading-relaxed text-(--hg-muted)">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default memo(AboutAgodi);

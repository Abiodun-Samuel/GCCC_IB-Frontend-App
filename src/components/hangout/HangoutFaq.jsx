import { memo } from 'react';
import { Plus } from 'lucide-react';
import { FAQS } from './hangoutContent';
import { CONTAINER, SECTION, SECTION_TITLE } from './hangoutStyles';

/* Native <details>: keyboard and screen-reader friendly with no state to manage. */
const HangoutFaq = () => (
  <section id="faq" className={`${SECTION} bg-(--hg-bg)`} aria-labelledby="faq-title">
    <div className={`${CONTAINER} grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16`}>
      <header>
        <h2 id="faq-title" className={SECTION_TITLE}>Good to know</h2>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-(--hg-muted)">
          What members usually ask before the day. Anything else? Ask us at church.
        </p>
      </header>

      <div className="grid gap-3">
        {FAQS.map(({ question, answer }) => (
          <details key={question} className="group rounded-2xl bg-(--hg-surface) transition-colors open:bg-(--hg-tint)">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-2xl px-5 py-5 text-lg font-bold text-(--hg-ink) focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--hg-brand)/40 sm:px-6 [&::-webkit-details-marker]:hidden">
              {question}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--hg-tint) text-(--hg-brand) transition-transform group-open:bg-(--hg-surface) group-open:rotate-45">
                <Plus size={18} aria-hidden="true" />
              </span>
            </summary>
            <p className="-mt-1 px-5 pb-6 pr-14 text-base leading-relaxed text-(--hg-muted) sm:px-6 sm:pr-16">{answer}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default memo(HangoutFaq);

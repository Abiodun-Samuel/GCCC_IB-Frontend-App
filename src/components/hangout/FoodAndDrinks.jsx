import { memo } from 'react';
import HangoutPhoto from './HangoutPhoto';
import PhotoCredit from './PhotoCredit';
import { DISPLAY } from './HangoutTheme';
import { FOOD_AND_DRINKS, FOOD_AND_DRINKS_INTRO } from './hangoutContent';
import { CONTAINER, SECTION, SECTION_TITLE } from './hangoutStyles';

/** Food, snacks, drinks and refreshments: four even cards, photo first. */
const FoodAndDrinks = () => (
  <section className={`${SECTION} bg-(--hg-surface)`} aria-labelledby="food-title">
    <div className={CONTAINER}>
      <header className="grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-16">
        <h2 id="food-title" className={SECTION_TITLE}>Eat, drink and refresh</h2>
        <p className="max-w-xl text-lg leading-relaxed text-(--hg-muted)">{FOOD_AND_DRINKS_INTRO}</p>
      </header>

      <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-16 lg:grid-cols-4">
        {FOOD_AND_DRINKS.map(({ title, description, icon: Icon, photo }) => (
          <li key={title} className="flex flex-col rounded-3xl bg-(--hg-bg) p-2 sm:p-2.5">
            <div className="overflow-hidden rounded-[1.25rem] bg-(--hg-line)">
              <HangoutPhoto photo={photo} Icon={Icon} sizes="(max-width: 1023px) 46vw, 22vw" />
            </div>
            <div className="flex flex-1 flex-col px-2.5 pb-3 pt-4 sm:px-3.5 sm:pb-4">
              <h3 className={`${DISPLAY} flex items-center gap-2.5 text-xl font-extrabold text-(--hg-ink) sm:text-2xl`}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-(--hg-surface) text-(--hg-brand) sm:h-9 sm:w-9">
                  <Icon size={17} aria-hidden="true" />
                </span>
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-(--hg-muted) sm:text-base">{description}</p>
              {photo.credit && <PhotoCredit credit={photo.credit} className="mt-auto pt-3 text-xs text-(--hg-muted)" />}
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default memo(FoodAndDrinks);

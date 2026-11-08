import { memo } from 'react';
import Picture from '@/components/Home/shared/Picture';
import { GALLERY_PHOTOS } from './hangoutContent';
import { CONTAINER, SECTION, SECTION_INTRO, SECTION_TITLE } from './hangoutStyles';

/*
 * An even grid: every gallery photo is a 3:2 landscape, so each cell is 3:2
 * and the rows and columns line up exactly. (Two library photos are 1070×716,
 * a hair off 3:2, so covering trims at most a pixel.) On phones the first
 * photo runs full width so the other eight pair up.
 */
const ChurchGallery = () => (
  <section className={`${SECTION} bg-(--hg-bg)`} aria-labelledby="gallery-title">
    <div className={CONTAINER}>
      <header>
        <h2 id="gallery-title" className={SECTION_TITLE}>Our church family</h2>
        <p className={SECTION_INTRO}>The best part of the day is who you spend it with.</p>
      </header>

      <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        {GALLERY_PHOTOS.map((name, i) => (
          <li key={name} className={`aspect-[3/2] overflow-hidden rounded-2xl bg-(--hg-line) lg:rounded-3xl ${i === 0 ? 'col-span-2 lg:col-span-1' : ''}`}>
            <Picture
              name={name}
              sizes={i === 0 ? '(max-width: 1023px) 92vw, 30vw' : '(max-width: 1023px) 46vw, 30vw'}
              className="block h-full w-full"
              imgClassName="block h-full w-full object-cover"
            />
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default memo(ChurchGallery);

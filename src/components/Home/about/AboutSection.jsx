import { memo } from 'react';
import { SECTION_SPACING } from '@/utils/constant';
import SectionHeader from '@/components/Home/shared/SectionHeader';
import ImagePanel from './ImagePanel';
import TextPanel from './TextPanel';
import ValuesGrid from './ValuesGrid';

/**
 * Retained by design: this section keeps the layout it already had. Only the
 * photographs, their alt text, the image delivery (Picture) and the shared
 * section header changed.
 */
const AboutSection = () => (
  <section
    id="about"
    className={`relative w-full overflow-hidden bg-white dark:bg-gray-950 ${SECTION_SPACING}`}
  >
    <div className="container relative z-10 mx-auto overflow-hidden px-2">
      <SectionHeader
        tone="light"
        eyebrow="Who We Are"
        titleLead="A Family"
        titleAccent="on Mission"
        subtitle="More than a gathering, a family of believers committed to the Word, the Spirit, and one another."
      />

      <div className="mb-14 grid grid-cols-1 items-center gap-10 sm:mb-16 lg:grid-cols-2 lg:gap-20">
        <ImagePanel />
        <TextPanel />
      </div>

      <ValuesGrid />
    </div>
  </section>
);

export default memo(AboutSection);

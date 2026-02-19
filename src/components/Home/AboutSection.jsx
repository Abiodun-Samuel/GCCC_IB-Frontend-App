import { useRef, memo } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Heart, Users, Crown } from 'lucide-react';
import { SECTION_SPACING } from '@/utils/constant';
import GallerySection from '@/components/Home/GallerySection';

// ─── Data ─────────────────────────────────────────────────────────────────────
const VALUES = [
    { icon: Heart, title: "Love", body: "Extending Christ's love to every person, no conditions." },
    { icon: Users, title: "Family", body: "Close-knit believers carrying one another through every season." },
    { icon: Crown, title: "Kingdom", body: "Kingdom culture practiced in every space we occupy." },
];

// ─── Variants ─────────────────────────────────────────────────────────────────
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const rise = { hidden: { opacity: 0, y: 36 }, visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } } };
const fromLeft = { hidden: { opacity: 0, x: -48 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };
const fromRight = { hidden: { opacity: 0, x: 48 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };
const ghostReveal = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
    },
};

// ─── Value Card ───────────────────────────────────────────────────────────────
const ValueCard = memo(({ icon: Icon, title, body }) => (
    <motion.div
        variants={rise}
        className="group flex flex-col gap-4 p-6 bg-gray-50 dark:bg-gray-900 hover:bg-[#0998d5] transition-colors duration-300 cursor-default"
    >
        <div className="w-10 h-10 rounded-lg bg-[#0998d5]/10 group-hover:bg-white/20 flex items-center justify-center transition-colors duration-300">
            <Icon className="w-5 h-5 text-[#0998d5] group-hover:text-white transition-colors duration-300" strokeWidth={1.8} />
        </div>
        <div>
            <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-white mb-1 transition-colors duration-300">
                {title}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-white/75 leading-relaxed transition-colors duration-300">
                {body}
            </p>
        </div>
    </motion.div>
));
ValueCard.displayName = "About.ValueCard";

// ─── Main ─────────────────────────────────────────────────────────────────────
const AboutSection = () => {
    const sectionRef = useRef(null);
    const imgRef = useRef(null);
    const inView = useInView(sectionRef, { once: true, margin: "-80px" });

    const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
    const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

    return (
        <section
            ref={sectionRef}
            id="about"
            className={`relative w-full bg-white dark:bg-gray-950 overflow-hidden ${SECTION_SPACING}`}
        >
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Label ──────────────────────────────────────────────────── */}
                <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={rise}
                    className="flex items-center gap-3 mb-10 sm:mb-12"
                >
                    <div className="h-px w-8 bg-[#0998d5]" />
                    <span className="text-[11px] font-bold tracking-[0.25em] text-[#0998d5] uppercase">
                        Who We Are
                    </span>
                </motion.div>

                {/* ── Main grid: image | text ─────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-14 sm:mb-16">

                    {/* Image */}
                    <motion.div
                        ref={imgRef}
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        variants={fromLeft}
                        className="relative overflow-hidden aspect-[4/3]"
                    >
                        <motion.img
                            src="/images/home/about.gif"
                            alt="GCCC Ibadan Community"
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ y: imgY, scale: 1.06 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                        {/* Location tag */}
                        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm px-2 py-1">
                            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-600 dark:text-gray-300">
                                Bodija · Ibadan
                            </span>
                        </div>
                    </motion.div>

                    {/* Text — ghost sits behind this column */}
                    <div className="relative overflow-hidden">

                        {/* ── Ghost watermark — SVG scales to exact container width ── */}
                        <motion.div
                            aria-hidden="true"
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            variants={ghostReveal}
                            className="pointer-events-none select-none absolute bottom-16 left-0 right-0 overflow-hidden"
                        >
                            <svg
                                viewBox="0 0 800 160"
                                preserveAspectRatio="xMidYMid meet"
                                className="w-full"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <text
                                    x="50%"
                                    y="88%"
                                    textAnchor="middle"
                                    dominantBaseline="auto"
                                    fontFamily="'Arial Black', 'Impact', sans-serif"
                                    fontWeight="900"
                                    fontSize="170"
                                    letterSpacing="-4"
                                    fill="rgba(17,155,214,0.055)"
                                    stroke="rgba(17,155,214,0.07)"
                                    strokeWidth="0.4"
                                >
                                    GCCC IB
                                </text>
                            </svg>
                        </motion.div>

                        {/* ── Actual text content ───────────────────────────── */}
                        <motion.div
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            variants={stagger}
                            className="relative z-10 flex flex-col gap-6"
                        >
                            <motion.h2
                                variants={fromRight}
                                className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black leading-tight tracking-tight text-gray-900 dark:text-white"
                                style={{ fontFamily: "'Georgia', serif" }}
                            >
                                Where{" "}
                                <span className="text-[#0998d5]">Love</span>,{" "}
                                <span className="text-[#0998d5]">Family</span>{" "}
                                &amp;{" "}
                                <span className="text-[#0998d5]">Kingdom</span>{" "}
                                converge.
                            </motion.h2>

                            <motion.p variants={rise} className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                GCCC Ibadan is a growing community of close-knit believers in Bodija, extending the frontiers of the Kingdom on all sides.
                            </motion.p>

                            <motion.p variants={rise} className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                We do the Word, yield to the Spirit and practice the Culture of God's Kingdom — with a deep desire to regularly experience and manifest the Glory of God.
                            </motion.p>

                            {/* Statement */}
                            <motion.div
                                variants={rise}
                                className="border-l-2 border-[#0998d5] pl-4"
                            >
                                <p className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Georgia', serif" }}>
                                    The plan is to take our generation for Jesus.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* ── Values ─────────────────────────────────────────────────── */}
                <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={stagger}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                    {VALUES.map((v) => (
                        <ValueCard key={v.title} {...v} />
                    ))}
                </motion.div>

            </div>
            <GallerySection />
        </section>
    );
};

export default AboutSection;
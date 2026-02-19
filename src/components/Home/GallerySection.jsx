import { memo, useRef } from "react";
import { motion, useInView } from "framer-motion";

const cssUrl = (path) => `url("${encodeURI(path)}")`;

const LETTERS = [
    { char: "G", src: "/images/home/about1.jpg" },
    { char: "C", src: "/images/home/about3.jpg" },
    { char: "C", src: "/images/home/about6.jpg" },
    { char: "C", src: "/images/home/about2.jpg" },
    { char: "I", src: "/images/home/about4.jpg" },
    { char: "B", src: "/images/home/about5.jpg" },
];

// ─── Shared animation variants ────────────────────────────────────────────────

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
};

const letterVariants = {
    hidden: { opacity: 0, y: 90, scaleY: 0.6 },
    visible: {
        opacity: 1, y: 0, scaleY: 1,
        transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
    },
};

const mobileCardVariants = {
    hidden: { opacity: 0, y: 48, scale: 0.93 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
    },
};

const FONT_SIZE = "clamp(7rem, 24vw, 32rem)";

// ─── Desktop / Tablet letter (unchanged) ─────────────────────────────────────

const Letter = memo(({ char, src }) => (
    <motion.div
        variants={letterVariants}
        whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.22, ease: "easeOut" } }}
        style={{
            willChange: "transform",
            transformOrigin: "bottom center",
            width: "fit-content",
            padding: "30px 0px",
        }}
    >
        <span
            aria-hidden="true"
            style={{
                display: "block",
                fontFamily: "'Impact', 'Arial Black', 'Franklin Gothic Heavy', sans-serif",
                fontSize: FONT_SIZE,
                fontWeight: 900,
                lineHeight: 0.85,
                letterSpacing: 0,
                backgroundImage: cssUrl(src),
                backgroundSize: "160% 160%",
                backgroundPosition: "center",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                userSelect: "none",
            }}
        >
            {char}
        </span>
    </motion.div>
));
Letter.displayName = "GallerySection.Letter";

// ─── Mobile card ──────────────────────────────────────────────────────────────
//
// Each letter gets its own portrait photo card.
// The photo fills the card; the letter is a huge clipped-image watermark on top.
// A subtle dark gradient sits beneath the letter for legibility.

const MobileCard = memo(({ char, src, index }) => {
    // Alternate slight rotation for a collage / editorial feel
    const rotate = index % 2 === 0 ? "-1.2deg" : "1.2deg";

    return (
        <motion.div
            variants={mobileCardVariants}
            whileTap={{ scale: 0.97, transition: { duration: 0.15 } }}
            style={{
                willChange: "transform",
                borderRadius: "16px",
                overflow: "hidden",
                position: "relative",
                aspectRatio: "3 / 4",
                transform: `rotate(${rotate})`,
                boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
                cursor: "pointer",
            }}
        >
            {/* Photo background */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: cssUrl(src),
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />

            {/* Gradient overlay — darkens bottom, lets the letter pop */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(160deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.42) 100%)",
                }}
            />

            {/* Giant letter — image-clipped so the photo bleeds through the text */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <span
                    aria-hidden="true"
                    style={{
                        fontFamily:
                            "'Impact', 'Arial Black', 'Franklin Gothic Heavy', sans-serif",
                        fontSize: "clamp(5.5rem, 28vw, 14rem)",
                        fontWeight: 900,
                        lineHeight: 1,
                        letterSpacing: "-0.02em",
                        // Clip the SAME photo through the letter shape —
                        // creates a vivid "window-within-window" effect
                        backgroundImage: cssUrl(src),
                        backgroundSize: "180% 180%",
                        backgroundPosition: "center",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        color: "transparent",
                        // Bright white stroke so the letter reads over dark areas
                        WebkitTextStroke: "2px rgba(255,255,255,0.55)",
                        filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.55))",
                        userSelect: "none",
                    }}
                >
                    {char}
                </span>
            </div>
        </motion.div>
    );
});
MobileCard.displayName = "GallerySection.MobileCard";

// ─── Mobile container ─────────────────────────────────────────────────────────

const mobileContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09 } },
};

const MobileGallery = memo(({ inView }) => (
    <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={mobileContainerVariants}
        style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            padding: "0 16px",
            width: "100%",
        }}
    >
        {LETTERS.map((l, i) => (
            <MobileCard key={i} char={l.char} src={l.src} index={i} />
        ))}
    </motion.div>
));
MobileGallery.displayName = "GallerySection.MobileGallery";

// ─── Section ──────────────────────────────────────────────────────────────────

const GallerySection = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px 0px" });

    return (
        <section
            ref={ref}
            className="relative w-full bg-white dark:bg-gray-950 overflow-hidden py-8 sm:py-10 lg:py-14"
            aria-label="GCCCIB Gallery"
        >
            {/* Top fade */}
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white dark:from-gray-950 to-transparent pointer-events-none z-10" />
            {/* Bottom fade */}
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white dark:from-gray-950 to-transparent pointer-events-none z-10" />

            {/* ── MOBILE layout (< sm) ── */}
            <div className="sm:hidden relative w-full">
                <MobileGallery inView={inView} />
            </div>

            {/* ── TABLET + DESKTOP layout (≥ sm) — completely unchanged ── */}
            <div className="hidden sm:flex relative w-full justify-center">
                <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={containerVariants}
                    style={{
                        display: "inline-flex",
                        alignItems: "flex-end",
                        width: "100%",
                        justifyContent: "center",
                        overflow: "hidden",
                    }}
                >
                    {LETTERS.map((l, i) => (
                        <Letter key={i} char={l.char} src={l.src} index={i} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default memo(GallerySection);
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

const FONT_SIZE = "clamp(7rem, 24vw, 32rem)";

const Letter = memo(({ char, src, index }) => (
    <motion.div
        variants={letterVariants}
        whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.22, ease: "easeOut" } }}
        style={{
            willChange: "transform",
            transformOrigin: "bottom center",
            width: "fit-content",
            padding: '30px 0px'
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

const GallerySection = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px 0px" });

    return (
        <section
            ref={ref}
            className="relative w-full bg-white dark:bg-gray-950 overflow-hidden py-8 sm:py-10 lg:py-14"
            aria-label="GCCC Ibadan Gallery"
        >
            {/* Top fade — matches section bg in both modes */}
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white dark:from-gray-950 to-transparent pointer-events-none z-10" />
            {/* Bottom fade */}
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white dark:from-gray-950 to-transparent pointer-events-none z-10" />

            <div className="relative w-full flex justify-center">
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
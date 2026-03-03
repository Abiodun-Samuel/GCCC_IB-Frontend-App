import { memo, useState, useMemo } from "react";
import { SECTION_SPACING } from "@/utils/constant";
import { versionedAsset } from "@/utils/helper";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */

const LETTERS = [
    { char: "G", src: versionedAsset("/images/home/about1.jpg") },
    { char: "C", src: versionedAsset("/images/home/about3.jpg") },
    { char: "C", src: versionedAsset("/images/home/about6.jpg") },
    { char: "I", src: versionedAsset("/images/home/about4.jpg") },
    { char: "C", src: versionedAsset("/images/home/about2.jpg") },
    { char: "B", src: versionedAsset("/images/home/about5.jpg") },
];

/* ─────────────────────────────────────────────────────────────
   DESKTOP TILE
   Expand/collapse driven entirely by CSS flex + transition.
   No JS width computation — no blank frames.
───────────────────────────────────────────────────────────── */

const DesktopTile = memo(function DesktopTile({ item, isActive, isDimmed, onEnter, onLeave }) {
    return (
        <div
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            style={{
                flex: isActive ? "2 1 0%" : isDimmed ? "0.7 1 0%" : "1 1 0%",
                transition: "flex 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
                opacity: isDimmed ? 0.52 : 1,
                minWidth: 0,
                borderRadius: 10,
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
            }}
        >
            <img
                src={item.src}
                alt={`${item.char} gallery`}
                loading="lazy"
                draggable={false}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center 20%",
                    display: "block",
                    transform: isActive ? "scale(1.06)" : "scale(1)",
                    transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    transformOrigin: "center center",
                    userSelect: "none",
                    pointerEvents: "none",
                }}
            />

            {/* Bottom gradient */}
            <div style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.18) 40%, transparent 65%)",
            }} />

            {/* Letter label */}
            <div style={{
                position: "absolute",
                bottom: 22,
                left: 0,
                right: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pointerEvents: "none",
                gap: 8,
            }}>
                <div style={{
                    height: 2,
                    width: isActive ? 32 : 12,
                    borderRadius: 2,
                    backgroundColor: isActive ? "#0998d5" : "rgba(255,255,255,0.60)",
                    transition: "width 0.3s ease, background-color 0.3s ease",
                }} />
                <span style={{
                    color: "#fff",
                    fontSize: "clamp(1.6rem, 2.4vw, 2.2rem)",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    lineHeight: 1,
                    textShadow: isActive
                        ? "0 0 24px rgba(9,152,213,0.55), 0 2px 10px rgba(0,0,0,0.55)"
                        : "0 1px 12px rgba(0,0,0,0.65)",
                    transform: isActive ? "scale(1.12)" : "scale(1)",
                    display: "inline-block",
                    transition: "transform 0.3s ease, text-shadow 0.3s ease",
                    transformOrigin: "center bottom",
                }}>
                    {item.char}
                </span>
            </div>
        </div>
    );
});

/* ─────────────────────────────────────────────────────────────
   MOBILE CARD
   Pure static display — no interaction, no animation.
───────────────────────────────────────────────────────────── */

const MobileCard = memo(function MobileCard({ item }) {
    return (
        <div style={{
            position: "relative",
            borderRadius: 10,
            overflow: "hidden",
            aspectRatio: "3 / 4",
        }}>
            <img
                src={item.src}
                alt={`${item.char} gallery`}
                loading="lazy"
                draggable={false}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center 20%",
                    display: "block",
                    userSelect: "none",
                }}
            />

            {/* Bottom gradient */}
            <div style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)",
            }} />

            {/* Letter label */}
            <div style={{
                position: "absolute",
                bottom: 16,
                left: 0,
                right: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pointerEvents: "none",
                gap: 6,
            }}>
                <div style={{
                    height: 2,
                    width: 12,
                    borderRadius: 2,
                    backgroundColor: "rgba(255,255,255,0.60)",
                }} />
                <span style={{
                    color: "#fff",
                    fontSize: "clamp(1.4rem, 6.5vw, 1.9rem)",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    lineHeight: 1,
                    textShadow: "0 1px 12px rgba(0,0,0,0.65)",
                }}>
                    {item.char}
                </span>
            </div>
        </div>
    );
});

/* ─────────────────────────────────────────────────────────────
   ROOT COMPONENT
───────────────────────────────────────────────────────────── */

const GallerySection = () => {
    const [activeIdx, setActiveIdx] = useState(null);

    // Stable per-tile handlers — never recreated
    const enterHandlers = useMemo(
        () => LETTERS.map((_, i) => () => setActiveIdx(i)),
        []
    );
    const handleLeave = useMemo(() => () => setActiveIdx(null), []);

    return (
        <section
            className={`relative w-full bg-white dark:bg-gray-950 ${SECTION_SPACING}`}
            aria-label="GCCCIB Gallery"
        >
            <div className="container mx-auto px-2 py-6">

                {/*
                    DESKTOP / TABLET (≥ sm)
                    ─────────────────────────────────────────────────────────
                    Visibility controlled by Tailwind `sm:` — NO JavaScript.
                    Tiles are always in the DOM; CSS hides the container.
                    Accordion uses CSS flex transition — zero JS width math.
                */}
                <div
                    className="hidden sm:flex"
                    style={{
                        gap: 6,
                        height: "clamp(360px, 46vw, 560px)",
                        alignItems: "stretch",
                    }}
                >
                    {LETTERS.map((item, i) => (
                        <DesktopTile
                            key={i}
                            item={item}
                            isActive={activeIdx === i}
                            isDimmed={activeIdx !== null && activeIdx !== i}
                            onEnter={enterHandlers[i]}
                            onLeave={handleLeave}
                        />
                    ))}
                </div>

                {/*
                    MOBILE (< sm)
                    ─────────────────────────────────────────────────────────
                    Static 2-column grid, no interaction, no animation.
                */}
                <div
                    className="grid grid-cols-2 sm:hidden"
                    style={{ gap: 10 }}
                >
                    {LETTERS.map((item, i) => (
                        <MobileCard key={i} item={item} />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default memo(GallerySection);
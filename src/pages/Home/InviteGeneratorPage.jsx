import { useState, useCallback } from "react";
import FLYER_SRC from "./invite.png";
import PROGRAMME_IMG from "./design.jpeg";
import HomepageComponentCard from "@/components/common/HomepageComponentCard";

// Design tokens: monochromatic #0998d5 scale
// b50:#e6f5fc  b100:#c0e4f6  b200:#8fcce8  b300:#56b0d8
// b400:#0998d5  b500:#0780b5  b600:#056694  b700:#044d70
// b800:#02344d  b900:#011e2e

// Canvas constants
// Flyer: 1200x1800px. NAME_Y_RATIO 0.175 lands on the blank underline after "HI,"
const NAME_X_RATIO = 0.145;
const NAME_Y_RATIO = 0.185;
const NAME_FONT_SIZE_RATIO = 0.036;
const NAME_MAX_WIDTH_RATIO = 0.70;
const NAME_FONT_FAMILY = "Georgia, 'Times New Roman', serif";
const NAME_COLOR = "#1a1a1a";

// ─── Utilities ────────────────────────────────────────────────────────────────

function capitalizeWords(str) {
    return str.trim().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function parseNames(input) {
    return input.split(",").map((s) => capitalizeWords(s)).filter((s) => s.length > 0);
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load flyer image."));
        img.src = src;
    });
}

export function generatePersonalizedInvite(name, flyerImg) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        canvas.width = flyerImg.naturalWidth;
        canvas.height = flyerImg.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(flyerImg, 0, 0);

        const maxWidth = canvas.width * NAME_MAX_WIDTH_RATIO;
        let fontSize = Math.round(canvas.width * NAME_FONT_SIZE_RATIO);
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = NAME_COLOR;
        ctx.font = `bold ${fontSize}px ${NAME_FONT_FAMILY}`;

        while (ctx.measureText(name).width > maxWidth && fontSize > 14) {
            fontSize--;
            ctx.font = `bold ${fontSize}px ${NAME_FONT_FAMILY}`;
        }

        ctx.fillText(
            name,
            Math.round(canvas.width * NAME_X_RATIO),
            Math.round(canvas.height * NAME_Y_RATIO),
            maxWidth,
        );

        canvas.toBlob((blob) => {
            if (!blob) { reject(new Error("Canvas export failed.")); return; }
            const file = new File([blob], `invite-${name.replace(/\s+/g, "_")}.png`, { type: "image/png" });
            const dataUrl = canvas.toDataURL("image/png");
            resolve({ file, dataUrl, name });
        }, "image/png");
    });
}

function buildShareText(name) {
    return (
        `Hi ${name}!\n\n` +
        `I would love to personally invite you to the Prophetic and Apostolic Congress: House of God, ` +
        `hosted by Glory Centre Community Church (GCCC) Ibadan.\n\n` +
        `Dates: 7th to 10th May, 2026\n` +
        `Time: 6:00 PM Prompt\n` +
        `Venue: No. 13, Oluwole Akintola Way, Iyana Bodija Expressway, Ibadan\n\n` +
        `Your personalised invitation is attached. I really hope to see you there.`
    );
}

export async function shareInvite(file, name) {
    const shareData = {
        title: "Prophetic and Apostolic Congress: House of God",
        text: buildShareText(name),
        files: [file],
    };
    if (navigator.share && navigator.canShare?.(shareData)) {
        try { await navigator.share(shareData); return; }
        catch (e) { if (e.name === "AbortError") return; }
    }
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file.name;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ShareIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
    );
}

function Spinner() {
    return (
        <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
    );
}

function InviteCard({ item }) {
    return (
        <div className="bg-white dark:bg-[#011e2e] border border-[#c0e4f6] dark:border-[#02344d] rounded-2xl overflow-hidden">
            <img src={item.dataUrl} alt={`Invitation for ${item.name}`} className="w-full block" />
            <div className="p-3">
                <p className="text-xs font-bold text-[#02344d] dark:text-[#c0e4f6] mb-2 truncate">{item.name}</p>
                <button
                    onClick={() => shareInvite(item.file, item.name)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold
                        bg-[#e6f5fc] dark:bg-[#02344d] text-[#056694] dark:text-[#8fcce8]
                        border border-[#8fcce8] dark:border-[#044d70] rounded-lg
                        hover:bg-[#0998d5] hover:text-white hover:border-[#0998d5] transition-colors duration-150"
                >
                    <ShareIcon /> Share
                </button>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InviteGenerator() {
    const [input, setInput] = useState("");
    const [generatedItems, setGeneratedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");
    const [progress, setProgress] = useState(0);

    const handleGenerate = useCallback(async () => {
        setError(""); setStatus(""); setGeneratedItems([]);
        const names = parseNames(input);
        if (!names.length) { setError("Please enter at least one name."); return; }
        setIsLoading(true); setProgress(0);
        try {
            const flyerImg = await loadImage(FLYER_SRC);
            const results = [];
            for (let i = 0; i < names.length; i++) {
                results.push(await generatePersonalizedInvite(names[i], flyerImg));
                setProgress(Math.round(((i + 1) / names.length) * 100));
            }
            setGeneratedItems(results);
            setStatus(`${results.length} invitation${results.length !== 1 ? "s" : ""} ready.`);
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false); setProgress(0);
        }
    }, [input]);

    const handleReset = useCallback(() => {
        setInput(""); setGeneratedItems([]); setError(""); setStatus(""); setProgress(0);
    }, []);

    const metaItems = [
        {
            label: "Dates",
            value: "7th to 10th May, 2026",
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0e4f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            ),
        },
        {
            label: "Time",
            value: "6:00 PM Prompt",
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0e4f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
        },
        {
            label: "Venue",
            value: "No. 13, Oluwole Akintola Way, Iyana Bodija Expressway, Ibadan",
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0e4f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
            ),
        },
    ];

    return (
        <HomepageComponentCard>

            {/* Hero */}
            <div className="relative bg-[#0998d5] dark:bg-[#0780b5] overflow-hidden px-6 pt-9 pb-8">
                <div className="absolute w-56 h-56 rounded-full bg-[#56b0d8] opacity-20 -top-14 -right-14 pointer-events-none" />
                <div className="absolute w-28 h-28 rounded-full bg-[#56b0d8] opacity-20 -bottom-8 left-5 pointer-events-none" />
                <div className="relative">
                    <span className="inline-flex items-center gap-1.5 bg-[#56b0d8]/40 text-[#011e2e] dark:text-[#c0e4f6] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#044d70] inline-block" />
                        Glory Centre Community Church, Ibadan
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                        Prophetic and Apostolic Congress: House of God
                    </h1>
                </div>
            </div>

            {/* Meta strip */}
            <div className="bg-[#0780b5] dark:bg-[#044d70] px-6 py-4 flex flex-wrap gap-5">
                {metaItems.map(({ label, value, icon }) => (
                    <div key={label} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#0998d5] dark:bg-[#0780b5] flex items-center justify-center flex-shrink-0 mt-0.5">
                            {icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-[#8fcce8] mb-0.5">{label}</p>
                            <p className="text-sm font-semibold text-white leading-snug">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-6">
                {/* About + programme thumbnail side by side */}
                <div className="bg-white dark:bg-[#011e2e] border border-[#8fcce8] dark:border-[#044d70] rounded-2xl p-5 mb-6">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-[#0780b5] dark:text-[#56b0d8] mb-3">
                        About the programme
                    </p>
                    <div className="flex flex-col md:flex-row gap-10">
                        {/* Portrait thumbnail — 80px wide, clips to a card shape */}
                        <div className="flex-shrink-0 w-80 rounded-xl overflow-hidden border border-[#c0e4f6] dark:border-[#02344d] self-start shadow-sm">
                            <img
                                src={PROGRAMME_IMG}
                                alt="Programme poster"
                                className="w-full block"
                            />
                        </div>
                        {/* Description */}
                        <div className="flex-1 self-center">
                            <p className="text-base text-[#056694] dark:text-[#8fcce8] leading-[1.75]">
                                The{" "}
                                <strong className="text-[#02344d] dark:text-white">
                                    Prophetic and Apostolic Congress: House of God
                                </strong>{" "}
                                is a four-day gathering hosted by Glory Centre Community Church (GCCC) Ibadan,
                                running from{" "}
                                <strong className="text-[#02344d] dark:text-white">7th to 10th May 2026</strong>.
                                This congress brings together prophetic and apostolic voices to minister,
                                intercede, and activate believers across the nation. Doors open at{" "}
                                <strong className="text-[#02344d] dark:text-white">6:00 PM prompt</strong> each evening.
                                Expect an atmosphere charged with the Word of God, prophetic declarations,
                                and deep worship you will carry with you long after.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-[#c0e4f6] dark:bg-[#02344d] mb-6" />

                {/* Generator heading */}
                <div className="mb-4">
                    <h2 className="text-lg font-extrabold text-[#02344d] dark:text-white mb-1">
                        Personalised invitation generator
                    </h2>
                    <p className="text-sm text-[#056694] dark:text-[#8fcce8] leading-relaxed">
                        Invite someone to this programme by generating a personalised flyer just for them.
                        Enter the names of the people you would like to invite — each person will get their
                        own invitation card with their name on it, ready to share directly from your device.
                    </p>
                </div>

                {/* Input card */}
                <div className="bg-white dark:bg-[#011e2e] border border-[#8fcce8] dark:border-[#044d70] rounded-2xl p-5 mb-6">
                    <label
                        htmlFor="namesInput"
                        className="block text-[11px] font-bold tracking-widest uppercase text-[#0780b5] dark:text-[#56b0d8] mb-2"
                    >
                        Recipient names
                    </label>
                    <textarea
                        id="namesInput"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        rows={3}
                        disabled={isLoading}
                        placeholder="e.g. Samuel, Deborah, Michael"
                        className="w-full px-3 py-2.5 text-sm bg-[#e6f5fc] dark:bg-[#02344d] border border-[#8fcce8] dark:border-[#044d70] rounded-xl
                            text-[#011e2e] dark:text-[#e6f5fc] placeholder-[#56b0d8] dark:placeholder-[#0998d5] resize-y
                            focus:outline-none focus:ring-2 focus:ring-[#0998d5] focus:border-[#0998d5]
                            disabled:opacity-50 transition"
                    />

                    {isLoading && progress > 0 && (
                        <div className="mt-3 h-0.5 bg-[#c0e4f6] dark:bg-[#02344d] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#0998d5] rounded-full transition-all duration-200"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}

                    {error && <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
                    {!error && status && <p className="mt-2 text-xs text-[#056694] dark:text-[#8fcce8]">{status}</p>}

                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold
                                bg-[#0998d5] text-white rounded-xl
                                hover:bg-[#0780b5] disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? <><Spinner /> Generating</> : "Generate invites"}
                        </button>
                        <button
                            onClick={handleReset}
                            disabled={isLoading}
                            className="px-4 py-2.5 text-sm font-semibold text-[#056694] dark:text-[#8fcce8]
                                border border-[#8fcce8] dark:border-[#044d70] rounded-xl
                                hover:bg-[#e6f5fc] dark:hover:bg-[#02344d] disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Output grid */}
                {generatedItems.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-10">
                        {generatedItems.map((item) => (
                            <InviteCard key={item.name} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </HomepageComponentCard>
    );
}
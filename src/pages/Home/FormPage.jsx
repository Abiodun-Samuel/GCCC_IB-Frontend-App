import { useMemo, useEffect } from "react";
import QuestionForm from "../../components/Formpage/QuestionForm";
import PrayerForm from "../../components/Formpage/PrayerForm";
import TestimonyForm from "../../components/Formpage/TestimonyForm";
import Animated from "../../components/common/Animated";
import { Tabs } from "@/components/ui/tab/Tabs";
import useQueryParam from "@/hooks/useQueryParam";
import { PrayerIcon, QuestionIcon, TestimonyIcon } from "@/icons";
import HomepageComponentCard from "@/components/common/HomepageComponentCard";
import PageHeader from "@/components/common/PageHeader";
import { MapPin } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

/* ─────────────────────────────────────────────────────────────
   Brand tokens
────────────────────────────────────────────────────────────── */
const B = "#0998d5";
const B_D = "#0778aa";
const B_DD = "#055a82";
const B_RGB = "9,152,213";

/* ─────────────────────────────────────────────────────────────
   Tab config
────────────────────────────────────────────────────────────── */
const TABS_CONFIG = [
  {
    key: "question",
    label: "Question",
    icon: QuestionIcon,
    eyebrow: "Ask anything",
    headline: "Got a question?",
    body: "Bible questions, life questions, doctrinal questions — ask them all. Our pastoral team reads every single one.",
  },
  {
    key: "prayer",
    label: "Prayer Request",
    icon: PrayerIcon,
    eyebrow: "Intercession",
    headline: "We'll pray with you.",
    body: "Send your prayer request knowing that whatever we ask in His name, He will do it. Let's glorify the Father together.",
  },
  {
    key: "testimony",
    label: "Testimony",
    icon: TestimonyIcon,
    eyebrow: "Share your story",
    headline: "What has God done?",
    body: "At GCCC we have a culture of sharing what the Lord has done. Your testimony strengthens the faith of the whole family.",
  },
];

const DEFAULT_TAB = "question";

const FORM_COMPONENTS = {
  question: QuestionForm,
  prayer: PrayerForm,
  testimony: TestimonyForm,
};

/* ═════════════════════════════════════════════════════════════
   LEFT INFO PANEL
   · Deep ocean brand gradient (same system as FirstTimerWelcomePage)
   · Shows eyebrow + headline + body for the active tab
   · Static "All channels" list below
   · Sticky on desktop
═════════════════════════════════════════════════════════════ */
const InfoPanel = ({ activeKey }) => {
  const active = TABS_CONFIG.find((t) => t.key === activeKey) || TABS_CONFIG[0];

  return (
    <div
      className="hidden lg:flex flex-col gap-8 rounded-2xl p-8 sticky top-8 overflow-hidden"
      style={{
        background: `linear-gradient(155deg, ${B_D} 0%, ${B_DD} 55%, #033d5c 100%)`,
        boxShadow: `0 20px 60px rgba(${B_RGB},0.28)`,
      }}
    >
      {/* Mesh blobs */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "rgba(255,255,255,0.05)", filter: "blur(40px)" }} />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full pointer-events-none"
        style={{ background: "rgba(255,255,255,0.04)", filter: "blur(28px)" }} />

      {/* Church identity */}
      <div className="relative flex flex-col gap-2.5" data-aos="fade-right" data-aos-duration="500">
        <span
          className="text-[10px] font-black uppercase tracking-[0.25em]"
          style={{ color: "rgba(255,255,255,0.48)" }}
        >
          Connect with us
        </span>
        <h1 className="text-2xl font-bold text-white leading-snug tracking-tight">
          Glory Centre<br />Community Church
        </h1>
        <p
          className="text-[13px] leading-relaxed"
          style={{ color: "rgba(255,255,255,0.60)" }}
        >
          We read every message. Your words matter to us and to God.
        </p>
      </div>

      {/* Rule */}
      <div className="relative h-px" style={{ background: "rgba(255,255,255,0.12)" }} />

      {/* Active tab context — transitions with tab */}
      <div
        className="relative flex flex-col gap-2.5"
        data-aos="fade-right"
        data-aos-delay="80"
        data-aos-duration="500"
        key={activeKey}
      >
        <span
          className="text-[10px] font-black uppercase tracking-[0.2em]"
          style={{ color: "rgba(255,255,255,0.38)" }}
        >
          {active.eyebrow}
        </span>
        <p className="text-lg font-bold text-white leading-snug">
          {active.headline}
        </p>
        <p
          className="text-[13px] leading-relaxed"
          style={{ color: "rgba(255,255,255,0.58)" }}
        >
          {active.body}
        </p>
      </div>

      {/* Rule */}
      <div className="relative h-px" style={{ background: "rgba(255,255,255,0.10)" }} />

      {/* Channel list */}
      <div
        className="relative flex flex-col gap-3"
        data-aos="fade-right"
        data-aos-delay="140"
        data-aos-duration="500"
      >
        <span
          className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5"
          style={{ color: "rgba(255,255,255,0.30)" }}
        >
          All Channels
        </span>

        {TABS_CONFIG.map(({ key, label, icon: Icon }) => {
          const isCurrent = key === activeKey;
          return (
            <div key={key} className="flex items-center gap-3">
              {/* Node */}
              <div
                className={`
                                    shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
                                    transition-all duration-200
                                    ${isCurrent
                    ? "bg-white shadow-lg"
                    : "border border-white/20"
                  }
                                `}
                style={isCurrent
                  ? { boxShadow: "0 0 0 3px rgba(255,255,255,0.14)" }
                  : {}
                }
              >
                <Icon
                  className="w-3.5 h-3.5"
                  style={{ color: isCurrent ? B_D : "rgba(255,255,255,0.40)" }}
                />
              </div>
              <span
                className={`
                                    text-[13px] font-semibold transition-colors duration-200
                                    ${isCurrent ? "text-white" : "text-white/35"}
                                `}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Location footer */}
      <div
        className="relative mt-auto pt-2 flex items-center gap-1.5"
        style={{ color: "rgba(255,255,255,0.26)" }}
      >
        <MapPin size={11} className="shrink-0" />
        <span className="text-[11px]">Ibadan, Nigeria</span>
      </div>
    </div>
  );
};

/* ═════════════════════════════════════════════════════════════
   MAIN PAGE
═════════════════════════════════════════════════════════════ */
export default function FormPage() {
  const [activeTab, setActiveTab] = useQueryParam("tab", DEFAULT_TAB);

  const validatedTab = TABS_CONFIG.some((t) => t.key === activeTab)
    ? activeTab
    : DEFAULT_TAB;

  const ActiveFormComponent = useMemo(
    () => FORM_COMPONENTS[validatedTab] || FORM_COMPONENTS[DEFAULT_TAB],
    [validatedTab]
  );

  /* AOS init */
  useEffect(() => {
    AOS.init({ duration: 520, easing: "ease-out-cubic", once: true, offset: 20 });
  }, []);

  return (
    <HomepageComponentCard>

      {/* Page Header */}
      <PageHeader
        eyebrow="Connect"
        title="Reach Out to Us"
      />

      {/* Two-column layout */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr]
                    gap-8 lg:gap-10 items-start mt-8 pb-16"
      >

        {/* Left — brand panel */}
        <div data-aos="fade-right" data-aos-duration="520">
          <InfoPanel activeKey={validatedTab} />
        </div>

        {/* Right — form panel */}
        <div
          className="rounded-2xl overflow-hidden
                        border border-slate-200 dark:border-slate-700/50
                        bg-white dark:bg-slate-900/60
                        shadow-[0_4px_40px_rgba(0,0,0,0.06)] dark:shadow-none"
          data-aos="fade-left"
          data-aos-duration="520"
          data-aos-delay="60"
        >
          {/* ── Panel header — tabs ── */}
          <div
            className="px-6 sm:px-8 py-5
                            border-b border-slate-100 dark:border-slate-700/50
                            bg-slate-50/80 dark:bg-slate-800/50"
          >
            <Tabs
              tabs={TABS_CONFIG}
              activeTab={validatedTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* ── Mobile context bar (hidden lg+) ── */}
          {(() => {
            const meta = TABS_CONFIG.find((t) => t.key === validatedTab);
            return (
              <div
                className="lg:hidden flex items-center gap-3 px-6 py-3
                                    border-b border-slate-100 dark:border-slate-700/40"
                style={{ background: `rgba(${B_RGB},0.06)` }}
              >
                <span
                  className="block w-[3px] h-4 rounded-full flex-shrink-0"
                  style={{ background: B }}
                />
                <span
                  className="text-[11px] font-bold"
                  style={{ color: B }}
                >
                  {meta?.eyebrow}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  — {meta?.headline}
                </span>
              </div>
            );
          })()}

          {/* ── Form body ── */}
          <div className="p-6 sm:p-8">
            <Animated key={validatedTab} animation="slide-up">
              <div
                role="tabpanel"
                id={`panel-${validatedTab}`}
                aria-labelledby={`tab-${validatedTab}`}
              >
                <ActiveFormComponent />
              </div>
            </Animated>
          </div>
        </div>

      </div>
    </HomepageComponentCard>
  );
}
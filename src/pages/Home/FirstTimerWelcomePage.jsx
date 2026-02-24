import { useState, useCallback, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { firstTimerSchema } from "../../schema/index";
import {
  Step1PersonalInfo,
  Step2FriendFamilyLocation,
  Step3Interest,
  Step4Details,
  Step5Experience,
} from "../../components/firstTimer/stepform";
import { useCreateFirstTimer } from "../../queries/firstTimer.query";
import Message from "../../components/common/Message";
import Button from "../../components/ui/Button";
import { Toast } from "../../lib/toastify";
import { formatBirthDate, handleApiError } from "../../utils/helper";
import { ProgressIndicator } from "@/components/firstTimer/ProgressIndicator";
import SuccessCompletion from "@/components/firstTimer/SuccessCompletion";
import HomepageComponentCard from "@/components/common/HomepageComponentCard";
import PageHeader from "@/components/common/PageHeader";
import { CheckCircle2, MapPin } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

/* ─────────────────────────────────────────────────────────────
   Brand tokens
────────────────────────────────────────────────────────────── */
const B = "#0998d5";
const B_D = "#0778aa";         // 15% darker for gradients
const B_DD = "#055a82";         // 35% darker — panel deep end
const B_RGB = "9,152,213";

/* ─────────────────────────────────────────────────────────────
   Constants (untouched)
────────────────────────────────────────────────────────────── */
const TOTAL_STEPS = 5;

const STEP_VALIDATION_FIELDS = {
  1: ["first_name", "last_name", "email", "phone_number", "gender"],
  2: ["how_did_you_learn"],
  3: ["membership_interest", "located_in_ibadan"],
  4: ["address", "date_of_birth", "occupation", "born_again"],
  5: ["service_experience", "whatsapp_interest"],
};

/* ─────────────────────────────────────────────────────────────
   Step metadata — labels + descriptions for the left panel
────────────────────────────────────────────────────────────── */
const STEP_META = [
  { n: 1, label: "Personal Info", desc: "Tell us about yourself." },
  { n: 2, label: "Discovery", desc: "How did you find us?" },
  { n: 3, label: "Your Interest", desc: "Community and membership." },
  { n: 4, label: "More Details", desc: "Help us serve you better." },
  { n: 5, label: "Your Experience", desc: "Share your thoughts on today." },
];

/* ─────────────────────────────────────────────────────────────
   Payload builder (untouched)
────────────────────────────────────────────────────────────── */
const createFormPayload = (data) => {
  const howDidYouLearnValue =
    data.how_did_you_learn === "other"
      ? data.how_did_you_learn_other_text?.trim()
      : data.how_did_you_learn;

  return {
    first_name: data.first_name,
    last_name: data.last_name,
    phone_number: data.phone_number || `${data.first_name}${data.last_name}${Date.now()}`,
    email: data.email || `${data.first_name}${data.last_name}${Date.now()}@gmail.com`,
    gender: data.gender,
    located_in_ibadan: data.located_in_ibadan,
    membership_interest: data.membership_interest,
    is_student: data?.occupation?.toLowerCase()?.includes("student"),
    born_again: data.born_again || null,
    whatsapp_interest: data.whatsapp_interest,
    address: data.address || null,
    date_of_birth: formatBirthDate(data.date_of_birth),
    date_of_visit: new Date().toISOString(),
    occupation: data.occupation || null,
    service_experience: data.service_experience,
    prayer_point: data.prayer_point || null,
    invited_by: data.invited_by || null,
    status: "active",
    how_did_you_learn: howDidYouLearnValue,
  };
};

/* ═════════════════════════════════════════════════════════════
   LEFT INFO PANEL

   Design rationale:
   · Deep ocean gradient (B_D → B_DD) — keeps white text at
     ≥4.5:1 contrast while clearly belonging to the #0998d5 family
   · Circular SVG progress arc — premium feel, no third-party dep
   · Step checklist with three distinct states
   · Sticky so it anchors while the form scrolls
   · Hidden on mobile; replaced by a slim context bar above the form
═════════════════════════════════════════════════════════════ */
const InfoPanel = ({ currentStep, isComplete }) => {
  const pct = Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 100);
  const circumference = 2 * Math.PI * 22;   // r=22 → C≈138.2
  const dashLen = (pct / 100) * circumference;

  return (
    <div
      className="hidden lg:flex flex-col gap-8 rounded-2xl p-8 sticky top-8 overflow-hidden"
      style={{
        background: `linear-gradient(155deg, ${B_D} 0%, ${B_DD} 55%, #033d5c 100%)`,
        boxShadow: `0 20px 60px rgba(${B_RGB},0.30)`,
      }}
    >
      {/* ── Subtle mesh blobs ─────────────────────────────── */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "rgba(255,255,255,0.05)", filter: "blur(40px)" }} />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full pointer-events-none"
        style={{ background: "rgba(255,255,255,0.04)", filter: "blur(28px)" }} />

      {/* ── Church identity ───────────────────────────────── */}
      <div className="relative flex flex-col gap-2.5" data-aos="fade-right" data-aos-duration="500">
        <span className="text-[10px] font-black uppercase tracking-[0.25em]"
          style={{ color: "rgba(255,255,255,0.50)" }}>
          First Timer Registration
        </span>
        <h1 className="text-2xl font-bold text-white leading-snug tracking-tight">
          Glory Centre<br />Community Church
        </h1>
        <p className="text-[13px] leading-relaxed"
          style={{ color: "rgba(255,255,255,0.62)" }}>
          Propagating and normalizing Kingdom Culture in our closely-knit community of believers.
        </p>
      </div>

      {/* ── Rule ─────────────────────────────────────────── */}
      <div className="relative h-px"
        style={{ background: "rgba(255,255,255,0.12)" }} />

      {/* ── Progress arc + current step context ──────────── */}
      {!isComplete && (
        <div
          className="relative flex items-center gap-4"
          data-aos="fade-right"
          data-aos-delay="80"
          data-aos-duration="500"
        >
          {/* SVG ring */}
          <div className="relative w-[60px] h-[60px] shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
              {/* Track */}
              <circle
                cx="28" cy="28" r="22"
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="3.5"
              />
              {/* Fill */}
              <circle
                cx="28" cy="28" r="22"
                fill="none"
                stroke="rgba(255,255,255,0.88)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={`${dashLen} ${circumference}`}
                style={{ transition: "stroke-dasharray 0.7s ease" }}
              />
            </svg>
            {/* Pct label */}
            <span className="absolute inset-0 flex items-center justify-center
                            text-[11px] font-black text-white">
              {pct}%
            </span>
          </div>

          {/* Current step label */}
          <div>
            <p className="text-sm font-bold text-white leading-snug">
              {STEP_META[currentStep - 1]?.label}
            </p>
            <p className="text-[12px] mt-0.5"
              style={{ color: "rgba(255,255,255,0.55)" }}>
              {STEP_META[currentStep - 1]?.desc}
            </p>
          </div>
        </div>
      )}

      {/* ── Rule ─────────────────────────────────────────── */}
      <div className="relative h-px"
        style={{ background: "rgba(255,255,255,0.10)" }} />

      {/* ── Steps checklist ───────────────────────────────── */}
      {!isComplete && (
        <div
          className="relative flex flex-col gap-3"
          data-aos="fade-right"
          data-aos-delay="140"
          data-aos-duration="500"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5"
            style={{ color: "rgba(255,255,255,0.32)" }}>
            All Steps
          </span>

          {STEP_META.map(({ n, label }) => {
            const done = n < currentStep;
            const current = n === currentStep;
            const pending = n > currentStep;

            return (
              <div key={n} className="flex items-center gap-3">
                {/* Node */}
                <div
                  className={`
                                        shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                                        text-[10px] font-black transition-all duration-300
                                        ${pending ? "border border-white/20 text-white/25" : ""}
                                    `}
                  style={
                    done
                      ? { background: "rgba(255,255,255,0.88)", color: B_D }
                      : current
                        ? { background: "#fff", color: B_D, boxShadow: "0 0 0 3px rgba(255,255,255,0.18)" }
                        : {}
                  }
                >
                  {done
                    ? <CheckCircle2 size={10} strokeWidth={3} />
                    : n
                  }
                </div>

                {/* Label */}
                <span
                  className={`
                                        text-[13px] font-semibold transition-colors duration-200
                                        ${current ? "text-white" : ""}
                                        ${done ? "text-white/45 line-through" : ""}
                                        ${pending ? "text-white/25" : ""}
                                    `}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Location footer ───────────────────────────────── */}
      <div className="relative mt-auto pt-2 flex items-center gap-1.5"
        style={{ color: "rgba(255,255,255,0.28)" }}>
        <MapPin size={11} className="shrink-0" />
        <span className="text-[11px]">Ibadan, Nigeria</span>
      </div>
    </div>
  );
};

/* ═════════════════════════════════════════════════════════════
   MAIN PAGE
═════════════════════════════════════════════════════════════ */
const FirstTimerWelcomePage = () => {

  /* ── State ────────────────────────────────────────────── */
  const [step, setStep] = useState(1);

  const {
    mutateAsync: createFirstTimer,
    isPending,
    isError,
    error,
  } = useCreateFirstTimer();

  const form = useForm({
    resolver: yupResolver(firstTimerSchema),
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const isCompleteStep = useMemo(() => step === "complete", [step]);
  const isLastStep = useMemo(() => step === TOTAL_STEPS, [step]);

  /* AOS init */
  useEffect(() => {
    AOS.init({ duration: 520, easing: "ease-out-cubic", once: true, offset: 20 });
  }, []);

  /* ── Validation (untouched) ───────────────────────────── */
  const getValidationFields = useCallback((s) => {
    if (s === 2) {
      const how = getValues("how_did_you_learn");
      if (how === "other") return ["how_did_you_learn", "how_did_you_learn_other_text"];
      if (how === "Friend/Family") return ["how_did_you_learn", "invited_by"];
      return ["how_did_you_learn"];
    }
    if (s === 4) {
      return getValues("membership_interest") !== "No"
        ? ["address", "date_of_birth", "occupation", "born_again"]
        : [];
    }
    return STEP_VALIDATION_FIELDS[s] || [];
  }, [getValues]);

  const validateCurrentStep = useCallback(async () => {
    const fields = getValidationFields(step);
    if (!fields.length) return true;
    const valid = await trigger(fields);
    if (!valid) Toast.error("Please fill in all required fields correctly before proceeding.");
    return valid;
  }, [step, getValidationFields, trigger]);

  const getNextStep = useCallback(() => {
    if (step === 3) return getValues("membership_interest") === "No" ? 5 : 4;
    return step + 1;
  }, [step, getValues]);

  const getPreviousStep = useCallback(() => {
    if (step === 5) return getValues("membership_interest") === "No" ? 3 : 4;
    return Math.max(1, step - 1);
  }, [step, getValues]);

  const handleNextStep = useCallback(async () => {
    if (await validateCurrentStep()) setStep(getNextStep());
  }, [validateCurrentStep, getNextStep]);

  const handlePreviousStep = useCallback(() => setStep(getPreviousStep()), [getPreviousStep]);

  const handleFormSubmit = useCallback(async (data) => {
    try {
      await createFirstTimer(createFormPayload(data));
      setStep("complete");
    } catch (err) {
      Toast.error(`Form submission failed: ${handleApiError(err)}`);
    }
  }, [createFirstTimer]);

  const handleButtonClick = useCallback(async () => {
    if (isLastStep) await handleSubmit(handleFormSubmit)();
    else await handleNextStep();
  }, [isLastStep, handleSubmit, handleFormSubmit, handleNextStep]);

  /* ── Step renderer (untouched logic) ─────────────────── */
  const renderStepContent = () => ({
    1: <Step1PersonalInfo register={register} errors={errors} />,
    2: <Step2FriendFamilyLocation watch={watch} register={register} errors={errors} setValue={setValue} />,
    3: <Step3Interest register={register} errors={errors} />,
    4: <Step4Details register={register} errors={errors} />,
    5: <Step5Experience register={register} errors={errors} />,
  }[step] ?? null);

  /* ── Render ─────────────────────────────────────────── */
  return (
    <HomepageComponentCard>

      {/* Page Header */}
      <PageHeader
        eyebrow="Welcome"
        title="First Timer Registration"
      />

      {isCompleteStep ? (
        /* ── Success — centred, no two-col ── */
        <div
          className="max-w-lg mx-auto mt-10"
          data-aos="fade-up"
          data-aos-duration="500"
        >
          <SuccessCompletion />
        </div>
      ) : (
        /* ── Two-column layout ────────────────── */
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr]
                    gap-8 lg:gap-10 items-start mt-8 pb-16">

          {/* Left — brand panel (lg+) */}
          <div data-aos="fade-right" data-aos-duration="520">
            <InfoPanel currentStep={step} isComplete={isCompleteStep} />
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
            {/* ── Panel header — progress ── */}
            <div className="px-6 sm:px-8 py-5
                            border-b border-slate-100 dark:border-slate-700/50
                            bg-slate-50/80 dark:bg-slate-800/50">
              <ProgressIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
            </div>

            {/* ── Mobile context bar (hidden lg+) ── */}
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
                {STEP_META[step - 1]?.label}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                — {STEP_META[step - 1]?.desc}
              </span>
            </div>

            {/* ── Form body ── */}
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
                {renderStepContent()}

                {/* API error */}
                {isError && (
                  <div className="mt-6" data-aos="fade-up">
                    <Message variant="error" data={error?.data} />
                  </div>
                )}

                {/* ── Action buttons ── */}
                <div
                  className={`
                                        flex gap-3 mt-8 pt-6
                                        border-t border-slate-100 dark:border-slate-700/50
                                        ${step > 1 ? "justify-between" : "justify-end"}
                                    `}
                  data-aos="fade-up"
                  data-aos-delay="180"
                  data-aos-duration="380"
                >
                  {step > 1 && (
                    <Button
                      className="flex-1"
                      type="button"
                      onClick={handlePreviousStep}
                      variant="ghost"
                      size="md"
                    >
                      Previous
                    </Button>
                  )}
                  <Button
                    className="flex-1"
                    type="button"
                    loading={isPending}
                    onClick={handleButtonClick}
                    variant="primary"
                    size="md"
                  >
                    {isLastStep ? "Submit" : "Next"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

        </div>
      )}
    </HomepageComponentCard>
  );
};

export default FirstTimerWelcomePage;
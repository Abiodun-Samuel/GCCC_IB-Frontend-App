import { useEffect } from "react";
import Animated from "@/components/common/Animated";
import RadioSelectForm from "@/components/form/useForm/RadioSelectForm";
import TextAreaForm from "@/components/form/TextAreaForm";
import InputForm from "@/components/form/useForm/InputForm";
import RadioForm from "@/components/form/useForm/RadioForm";
import AOS from "aos";
import "aos/dist/aos.css";

/* ─────────────────────────────────────────────────────────────
   Brand tokens
────────────────────────────────────────────────────────────── */
const B = "#0998d5";
const B_RGB = "9,152,213";

const useAOS = () => {
  useEffect(() => {
    AOS.init({ duration: 520, easing: "ease-out-cubic", once: true, offset: 8 });
    AOS.refresh();
  }, []);
};

/* ─────────────────────────────────────────────────────────────
   StepSection — shared heading block
   · Left accent bar in brand blue
   · Eyebrow: brand blue (readable in both modes)
   · Title: full contrast slate-900 / white
   · Subtitle: slate-600 / slate-300 — genuinely readable
────────────────────────────────────────────────────────────── */
const StepSection = ({ eyebrow, title, subtitle, children }) => (
  <div className="flex flex-col gap-7">

    {/* Header */}
    <div className="flex flex-col gap-2.5" data-aos="fade-up" data-aos-duration="440">

      {/* Eyebrow with left bar */}
      {eyebrow && (
        <div className="flex items-center gap-2.5">
          <span
            className="block w-[3px] h-[18px] rounded-full flex-shrink-0"
            style={{ background: B }}
          />
          <span
            className="text-[11px] font-black uppercase tracking-[0.2em]"
            style={{ color: B }}
          >
            {eyebrow}
          </span>
        </div>
      )}

      {/* Title */}
      {title && (
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight
                    text-slate-900 dark:text-white leading-snug">
          {title}
        </h2>
      )}

      {/* Subtitle */}
      {subtitle && (
        <p className="text-[15px] leading-relaxed max-w-prose
                    text-slate-600 dark:text-slate-300">
          {subtitle}
        </p>
      )}
    </div>

    {/* Brand-tinted divider */}
    <div
      className="h-px"
      style={{
        background: `linear-gradient(90deg, rgba(${B_RGB},0.30) 0%, rgba(${B_RGB},0.06) 60%, transparent 100%)`
      }}
      data-aos="fade-right"
      data-aos-duration="380"
      data-aos-delay="80"
    />

    {/* Fields */}
    <div
      className="flex flex-col gap-5"
      data-aos="fade-up"
      data-aos-duration="480"
      data-aos-delay="110"
    >
      {children}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   Step 1 — Personal Information
────────────────────────────────────────────────────────────── */
export const Step1PersonalInfo = ({ register, errors }) => {
  useAOS();
  return (
    <Animated animation="fade-up">
      <StepSection
        eyebrow="Step 1 · Personal Info"
        title="Welcome to Glory Centre."
        subtitle="We're focused on propagating and normalizing Kingdom Culture in our closely-knit community of believers. We'd love to know you — please fill in your details below."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputForm
            label="First Name"
            name="first_name"
            placeholder="e.g. Abiodun"
            register={register}
            error={errors.first_name?.message}
            required
          />
          <InputForm
            label="Last Name"
            name="last_name"
            placeholder="e.g. Adeyemi"
            register={register}
            error={errors.last_name?.message}
            required
          />
        </div>

        <InputForm
          label="Phone Number"
          name="phone_number"
          placeholder="e.g. 08012345678"
          register={register}
          error={errors.phone_number?.message}
          required
        />

        <InputForm
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@example.com"
          register={register}
          error={errors.email?.message}
        />

        <RadioForm
          label="Gender"
          name="gender"
          type="radio"
          layout="grid"
          register={register}
          error={errors.gender?.message}
          required
          options={[
            { label: "Male", value: "Male" },
            { label: "Female", value: "Female" },
          ]}
        />
      </StepSection>
    </Animated>
  );
};

/* ─────────────────────────────────────────────────────────────
   Step 2 — Discovery
────────────────────────────────────────────────────────────── */
export const Step2FriendFamilyLocation = ({ watch, register, errors, setValue }) => {
  useAOS();
  const howDidYouLearn = watch("how_did_you_learn");

  return (
    <Animated animation="fade-up">
      <StepSection
        eyebrow="Step 2 · Discovery"
        title="How did you find us?"
        subtitle="Understanding how you discovered GCCC helps us reach more people just like you."
      >
        <RadioSelectForm
          label="How did you learn about us?"
          name="how_did_you_learn"
          register={register}
          setValue={setValue}
          watch={watch}
          error={errors.how_did_you_learn?.message}
          required
          options={[
            { id: "Social Media", name: "Social Media", description: "Facebook, Instagram, Twitter, etc." },
            { id: "Friend/Family", name: "Friend / Family", description: "Someone you know invited you" },
            { id: "Google Search", name: "Google Search", description: "Found us through a search engine" },
            { id: "Website", name: "Church Website", description: "Visited our official website" },
            { id: "Flyer", name: "Flyer / Poster", description: "Saw our promotional materials" },
          ]}
          enableOther
          otherLabel="Other (please specify)"
          otherPlaceholder="Please tell us how you found us"
          otherMinLength={2}
          otherRequired
        />

        {howDidYouLearn === "Friend/Family" && (
          <Animated animation="slide-down">
            <InputForm
              label="Who invited you?"
              name="invited_by"
              placeholder="Name of the person who invited you"
              register={register}
              error={errors.invited_by?.message}
              required
            />
          </Animated>
        )}
      </StepSection>
    </Animated>
  );
};

/* ─────────────────────────────────────────────────────────────
   Step 3 — Interest
────────────────────────────────────────────────────────────── */
export const Step3Interest = ({ register, errors }) => {
  useAOS();
  return (
    <Animated animation="fade-up">
      <StepSection
        eyebrow="Step 3 · Your Interest"
        title="Would you like to stay connected?"
        subtitle="Let us know your interest in being a regular part of our community — whether online or in person."
      >
        <RadioForm
          label="Do you currently reside in Ibadan?"
          name="located_in_ibadan"
          register={register}
          error={errors.located_in_ibadan?.message}
          required
          layout="grid"
          options={[
            { value: true, label: "Yes — I live, study or work here" },
            { value: false, label: "No — I'm visiting" },
          ]}
        />

        <RadioForm
          label="Would you be interested in becoming a consistent member of GCCC?"
          name="membership_interest"
          type="radio"
          register={register}
          error={errors.membership_interest?.message}
          required
          options={[
            { label: "Yes", value: "Yes" },
            { label: "Maybe", value: "Maybe" },
            { label: "No", value: "No" },
          ]}
        />
      </StepSection>
    </Animated>
  );
};

/* ─────────────────────────────────────────────────────────────
   Step 4 — More Details
────────────────────────────────────────────────────────────── */
export const Step4Details = ({ register, errors }) => {
  useAOS();
  return (
    <Animated animation="fade-up">
      <StepSection
        eyebrow="Step 4 · More Details"
        title="A little more about you."
        subtitle="These details help us serve and connect with you in a more personal way."
      >
        <InputForm
          label="Home Address in Ibadan"
          name="address"
          placeholder="e.g. 12 Bodija Street, Ibadan"
          register={register}
          error={errors.address?.message}
          required
        />

        <InputForm
          label="Date of Birth"
          name="date_of_birth"
          type="text"
          placeholder="dd/mm — e.g. 23/09"
          register={register}
          error={errors.date_of_birth?.message}
          required
        />

        <InputForm
          label="What do you do?"
          name="occupation"
          placeholder="e.g. Software Engineer, Student, Nurse…"
          register={register}
          error={errors.occupation?.message}
          required
        />

        <RadioForm
          label="Are you born again?"
          name="born_again"
          type="radio"
          register={register}
          error={errors.born_again?.message}
          required
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
            { label: "I'm not sure", value: "I'm not sure" },
          ]}
        />
      </StepSection>
    </Animated>
  );
};

/* ─────────────────────────────────────────────────────────────
   Step 5 — Service Experience
────────────────────────────────────────────────────────────── */
export const Step5Experience = ({ register, errors }) => {
  useAOS();
  return (
    <Animated animation="fade-up">
      <StepSection
        eyebrow="Step 5 · Your Experience"
        title="How was today's service?"
        subtitle="We genuinely love to hear your thoughts. Your feedback helps us grow and serve better."
      >
        <TextAreaForm
          label="What did you enjoy about the service today?"
          name="service_experience"
          placeholder="Share your experience…"
          register={register}
          error={errors.service_experience?.message}
          required
        />

        <TextAreaForm
          label="Prayer point (optional)"
          name="prayer_point"
          placeholder="Share your prayer point with us…"
          register={register}
          error={errors.prayer_point?.message}
        />

        <RadioForm
          label="Would you like to join our WhatsApp community?"
          name="whatsapp_interest"
          type="radio"
          register={register}
          layout="grid"
          error={errors.whatsapp_interest?.message}
          required
          options={[
            { label: "Yes, add me", value: true },
            { label: "No thank you", value: false },
          ]}
        />
      </StepSection>
    </Animated>
  );
};
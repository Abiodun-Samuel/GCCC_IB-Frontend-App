import { useEffect } from "react";
import { useForm } from "react-hook-form";
import InputForm from "../form/useForm/InputForm";
import Button from "../ui/Button";
import { useCreateFormMessages } from "@/queries/form.query";
import TextAreaForm from "@/components/form/TextAreaForm";
import { testimonyFormSchema } from "@/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthStore } from "@/store/auth.store";
import AOS from "aos";
import "aos/dist/aos.css";

/* ─── Brand ─────────────────────────────────────────────── */
const B = "#0998d5";
const B_D = "#0778aa";
const B_RGB = "9,152,213";

/* ─── Custom radio option ────────────────────────────────── */
const RadioOption = ({ name, value, label, register, checked }) => (
  <label
    className={`
            relative flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer
            border-2 transition-all duration-200 select-none
            ${checked
        ? "border-[#0998d5] bg-[#0998d5]/5 dark:bg-[#0998d5]/10"
        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600"
      }
        `}
  >
    <input
      type="radio"
      value={value}
      {...register}
      className="sr-only"
    />
    {/* Custom indicator */}
    <span
      className={`
                w-4 h-4 rounded-full border-2 flex items-center justify-center
                flex-shrink-0 transition-all duration-200
                ${checked
          ? "border-[#0998d5]"
          : "border-slate-300 dark:border-slate-600"
        }
            `}
    >
      {checked && (
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: B }}
        />
      )}
    </span>
    <span
      className={`
                text-sm font-semibold transition-colors duration-200
                ${checked
          ? "text-slate-900 dark:text-white"
          : "text-slate-600 dark:text-slate-400"
        }
            `}
    >
      {label}
    </span>
    {/* Active dot indicator */}
    {checked && (
      <span
        className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full"
        style={{ background: B }}
      />
    )}
  </label>
);

export default function TestimonyForm() {
  const { isAuthenticated, user } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(testimonyFormSchema),
  });

  const { mutate, isPending } = useCreateFormMessages({
    onSuccess: () => reset(),
  });

  useEffect(() => {
    AOS.init({ duration: 500, easing: "ease-out-cubic", once: true, offset: 8 });
    AOS.refresh();
  }, []);

  const sharePhysically = watch("sharePhysically");

  const onSubmit = (data) => {
    mutate({
      type: "testimony",
      content: data.content,
      name: data.name,
      phone_number: data.phone_number,
      wants_to_share_testimony: data.sharePhysically === "Yes",
      ...(isAuthenticated && user?.id ? { user_id: user.id } : {}),
    });
  };

  return (
    <div className="flex flex-col gap-7">

      {/* ── Section header ─────────────────────────────── */}
      <div
        className="flex flex-col gap-2.5"
        data-aos="fade-up"
        data-aos-duration="440"
      >
        {/* Eyebrow */}
        <div className="flex items-center gap-2.5">
          <span
            className="block w-[3px] h-[18px] rounded-full flex-shrink-0"
            style={{ background: B }}
          />
          <span
            className="text-[11px] font-black uppercase tracking-[0.2em]"
            style={{ color: B }}
          >
            Share Your Story
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight
                    text-slate-900 dark:text-white leading-snug">
          Hi Friend 👋
        </h2>

        <p className="text-[15px] leading-relaxed max-w-prose
                    text-slate-600 dark:text-slate-300">
          At GCCC Ibadan, we have a culture of sharing with the family of
          God what the Lord has done. We'd love to hear your testimony.
        </p>
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

      {/* ── Form ───────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5"
        data-aos="fade-up"
        data-aos-duration="480"
        data-aos-delay="110"
      >
        {/* Name + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputForm
            label="Your Name"
            name="name"
            type="text"
            required
            register={register}
            error={errors.name?.message}
            placeholder="Enter your name"
          />
          <InputForm
            label="Phone Number"
            name="phone_number"
            required
            type="text"
            register={register}
            error={errors.phone_number?.message}
            placeholder="e.g. 08012345678"
          />
        </div>

        {/* Testimony textarea */}
        <TextAreaForm
          label="What are your testimonies?"
          name="content"
          register={register}
          rows={6}
          required
          placeholder="Share what the Lord has done…"
          error={errors.content?.message}
        />

        {/* Physical sharing */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[13px] font-semibold
                        text-slate-700 dark:text-slate-300">
            Do you want to share your testimony physically?{" "}
            <span style={{ color: B }}>*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <RadioOption
              name="sharePhysically"
              value="Yes"
              label="Yes, I'd love to"
              register={register("sharePhysically", { required: "This field is required" })}
              checked={sharePhysically === "Yes"}
            />
            <RadioOption
              name="sharePhysically"
              value="No"
              label="No, not now"
              register={register("sharePhysically", { required: "This field is required" })}
              checked={sharePhysically === "No"}
            />
          </div>
          {errors.sharePhysically && (
            <p className="text-[12px] font-medium text-red-500 mt-0.5">
              {errors.sharePhysically.message}
            </p>
          )}
        </div>

        {/* Action */}
        <div className="mt-1 flex items-center justify-end">
          <Button
            type="submit"
            loading={isPending}
            size="md"
            variant="primary"
            className="w-full sm:w-auto"
          >
            Submit Testimony
          </Button>
        </div>
      </form>
    </div>
  );
}
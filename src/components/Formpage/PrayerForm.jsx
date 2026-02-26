import { useForm } from "react-hook-form";
import Button from "../../components/ui/Button";
import { useCreateFormMessages } from "@/queries/form.query";
import TextAreaForm from "@/components/form/TextAreaForm";
import { useAuthStore } from "@/store/auth.store";

/* ─── Brand ─────────────────────────────────────────────── */
const B = "#0998d5";
const B_RGB = "9,152,213";

export default function PrayerForm() {
  const { isAuthenticated, user } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate, isPending } = useCreateFormMessages({
    onSuccess: () => reset(),
  });

  const onSubmit = (data) => {
    mutate({
      type: "prayer",
      content: data.message,
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
            Prayer Request
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight
                    text-slate-900 dark:text-white leading-snug">
          Let's pray together.
        </h2>

        <p className="text-[15px] leading-relaxed max-w-prose
                    text-slate-600 dark:text-slate-300">
          Send your prayer request knowing that whatever we ask in His name,
          He will do it. Let's together glorify the Father through the power of prayer.
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
        data-aos="fade-up"
        data-aos-duration="480"
        data-aos-delay="110"
      >
        <TextAreaForm
          label="What is your prayer request?"
          name="message"
          register={register}
          rows={6}
          required
          placeholder="Share your prayer request here…"
          error={errors.message?.message}
        />

        {/* Action */}
        <div className="mt-6 flex items-center justify-end">
          <Button
            type="submit"
            loading={isPending}
            size="md"
            variant="primary"
            className="w-full sm:w-auto"
          >
            Submit Prayer
          </Button>
        </div>
      </form>
    </div>
  );
}
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Clock } from "lucide-react";
import HomepageComponentCard from "@/components/common/HomepageComponentCard";
import Message from "@/components/common/Message";
import InputForm from "@/components/form/useForm/InputForm";
import Button from "@/components/ui/Button";
import useGoBack from "@/hooks/useGoBack";
import { BackIcon2 } from "@/icons";
import { useForgotPassword } from "@/queries/auth.query";
import { forgotPasswordSchema } from "@/schema";
import { Toast } from "@/lib/toastify";
import { AuthLayout } from "@/pages/Home/Auth/AuthLayout";
import { AuthCard } from "@/pages/Home/Auth/AuthCard";

const B = "#0998d5";
const B_RGB = "9,152,213";

const COOLDOWN_DURATION = 5 * 60 * 1000;
const STORAGE_KEY = "forgot_password_cooldown";

const ForgotPasswordPage = () => {
    const { mutateAsync, isPending, isError, isSuccess, error } = useForgotPassword();
    const [searchParams] = useSearchParams();
    const goBack = useGoBack();

    const [cooldownEnd, setCooldownEnd] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(0);

    const emailParam = searchParams.get("email");

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(forgotPasswordSchema),
        defaultValues: { email: emailParam || "" },
    });

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const end = parseInt(stored, 10);
            if (end > Date.now()) setCooldownEnd(end);
            else localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    useEffect(() => {
        if (!cooldownEnd) { setTimeRemaining(0); return; }
        const tick = () => {
            const remaining = Math.max(0, cooldownEnd - Date.now());
            setTimeRemaining(remaining);
            if (remaining === 0) { setCooldownEnd(null); localStorage.removeItem(STORAGE_KEY); }
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [cooldownEnd]);

    const handleForgotPassword = useCallback(async (data) => {
        try {
            await mutateAsync(data);
            const end = Date.now() + COOLDOWN_DURATION;
            setCooldownEnd(end);
            localStorage.setItem(STORAGE_KEY, end.toString());
        } catch (err) {
            Toast.error("Failed to send reset link:", err);
        }
    }, [mutateAsync]);

    const formatTime = useCallback((ms) => {
        const total = Math.ceil(ms / 1000);
        const minutes = Math.floor(total / 60);
        const seconds = total % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }, []);

    const isButtonDisabled = isPending || timeRemaining > 0;

    const buttonText = useMemo(() => {
        if (isPending) return "Sending…";
        if (timeRemaining > 0) return `Resend in ${formatTime(timeRemaining)}`;
        return "Send Reset Link";
    }, [isPending, timeRemaining, formatTime]);

    const successMessage = useMemo(() => ({
        message: "Password reset link sent!",
        details: "Please check your inbox and spam folder. The link expires in 24 hours.",
    }), []);

    const backButton = (
        <button
            type="button"
            onClick={goBack}
            className="p-1.5 rounded-lg transition-colors
                text-slate-500 dark:text-slate-400
                hover:text-slate-900 dark:hover:text-white
                hover:bg-slate-100 dark:hover:bg-slate-800/60"
            aria-label="Go back"
        >
            <BackIcon2 className="w-4 h-4" />
        </button>
    );

    return (
        <HomepageComponentCard>
            <AuthLayout>
                <AuthCard
                    eyebrow="Account Recovery"
                    title="Forgot your password?"
                    tagline="Enter your email and we'll send you a link to reset your password."
                    backSlot={backButton}
                >
                    <form
                        onSubmit={handleSubmit(handleForgotPassword)}
                        noValidate
                        className="flex flex-col gap-5"
                    >
                        {isSuccess && <Message variant="success" data={successMessage} />}
                        {isError && error && <Message variant="error" data={error?.data} />}

                        <InputForm
                            label="Email Address"
                            name="email"
                            type="email"
                            register={register}
                            error={errors.email?.message}
                            placeholder="you@example.com"
                            required
                        />

                        {timeRemaining > 0 && (
                            <div
                                className="flex items-center gap-2.5 px-4 py-3 rounded-xl border text-[13px] font-medium"
                                style={{
                                    background: `rgba(${B_RGB},0.06)`,
                                    borderColor: `rgba(${B_RGB},0.20)`,
                                    color: B,
                                }}
                            >
                                <Clock size={14} className="flex-shrink-0" />
                                <span>
                                    You can resend in{" "}
                                    <strong>{formatTime(timeRemaining)}</strong>
                                </span>
                            </div>
                        )}

                        <Button
                            className="w-full mt-1"
                            type="submit"
                            loading={isPending}
                            disabled={isButtonDisabled}
                        >
                            {buttonText}
                        </Button>

                        <p className="text-center text-[13px] text-slate-500 dark:text-slate-400">
                            Remember your password?{" "}
                            <Link
                                to="/login"
                                className="font-semibold hover:underline underline-offset-2 transition-colors"
                                style={{ color: B }}
                            >
                                Sign in
                            </Link>
                        </p>
                    </form>
                </AuthCard>
            </AuthLayout>
        </HomepageComponentCard>
    );
};

export default ForgotPasswordPage;
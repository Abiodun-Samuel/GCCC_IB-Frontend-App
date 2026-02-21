import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

import Message from "@/components/common/Message";
import InputForm from "@/components/form/useForm/InputForm";
import Button from "@/components/ui/Button";
import useGoBack from "@/hooks/useGoBack";
import { BackIcon2 } from "@/icons";
import { useForgotPassword } from "@/queries/auth.query";
import { forgotPasswordSchema } from "@/schema";
import { Toast } from "@/lib/toastify";
import Animated from "@/components/common/Animated";
import HomepageComponentCard from "@/components/common/HomepageComponentCard";

const TAGLINE = "Enter your email address and we'll send you a link to reset your password.";
const COOLDOWN_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const STORAGE_KEY = "forgot_password_cooldown";

const ForgotPasswordPage = () => {
    const { mutateAsync, isPending, isError, isSuccess, error } = useForgotPassword();
    const [searchParams] = useSearchParams();
    const goBack = useGoBack();

    const [cooldownEnd, setCooldownEnd] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(0);

    const emailParam = searchParams.get('email');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(forgotPasswordSchema),
        defaultValues: { email: emailParam || '' }
    });

    // Initialize cooldown from storage on mount
    useEffect(() => {
        const storedCooldown = localStorage.getItem(STORAGE_KEY);
        if (storedCooldown) {
            const endTime = parseInt(storedCooldown, 10);
            if (endTime > Date.now()) {
                setCooldownEnd(endTime);
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    // Update countdown timer
    useEffect(() => {
        if (!cooldownEnd) {
            setTimeRemaining(0);
            return;
        }

        const updateTimer = () => {
            const remaining = Math.max(0, cooldownEnd - Date.now());
            setTimeRemaining(remaining);

            if (remaining === 0) {
                setCooldownEnd(null);
                localStorage.removeItem(STORAGE_KEY);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [cooldownEnd]);

    const handleForgotPassword = useCallback(async (data) => {
        try {
            await mutateAsync(data);

            // Start cooldown only on success
            const endTime = Date.now() + COOLDOWN_DURATION;
            setCooldownEnd(endTime);
            localStorage.setItem(STORAGE_KEY, endTime.toString());
        } catch (err) {
            Toast.error('Failed to send reset link:', err);
        }
    }, [mutateAsync]);

    const isButtonDisabled = isPending || timeRemaining > 0;

    const formatTime = useCallback((ms) => {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, []);

    const buttonText = useMemo(() => {
        if (isPending) return "Sending...";
        if (timeRemaining > 0) return `Resend in ${formatTime(timeRemaining)}`;
        return "Send Reset Link";
    }, [isPending, timeRemaining, formatTime]);

    const successMessage = useMemo(() => ({
        message: "Password reset link sent successfully! Please check your email inbox and spam folder.",
        details: "The link will expire in 24 hours."
    }), []);

    return (
        <HomepageComponentCard>
            <Animated animation={'zoom-in'} className="flex items-center justify-center px-4">
                <div className="w-full max-w-lg relative">
                    <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-3xl py-8 px-6 md:p-10 backdrop-blur-sm border-2 border-white/20 dark:border-gray-700/50 transition-all duration-300 hover:shadow-blue-500/10 dark:hover:shadow-blue-400/20 hover:border-white/30 dark:hover:border-gray-600/50">
                        <button
                            onClick={goBack}
                            type="button"
                            className="absolute left-10 top-10 hover:opacity-70 transition-opacity"
                            aria-label="Go back"
                        >
                            <BackIcon2 className="text-gray-700 dark:text-gray-200" />
                        </button>

                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 dark:from-blue-400/20 to-transparent rounded-bl-full pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 dark:from-purple-400/20 to-transparent rounded-tr-full pointer-events-none"></div>

                        {/* Header Section */}
                        <div className="text-center mb-7 relative">
                            <div className="space-y-1">
                                <Link to='/' className="flex items-center justify-center">
                                    <img
                                        width={55}
                                        src="/images/logo/gccc.png"
                                        alt="GCCC Logo"
                                        className="object-contain"
                                    />
                                </Link>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
                                    Forgot Password?
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {TAGLINE}
                                </p>
                            </div>

                            {/* Decorative Line */}
                            <div className="mt-6 flex items-center justify-center gap-2">
                                <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400"></div>
                                <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-5 relative">
                            {/* Success Message */}
                            {isSuccess && (
                                <Message variant="success" data={successMessage} />
                            )}

                            {/* Error Message */}
                            {isError && error && (
                                <Message variant="error" data={error?.data} />
                            )}

                            <InputForm
                                label="Email Address"
                                name="email"
                                type="email"
                                register={register}
                                error={errors.email?.message}
                                placeholder="Enter your email address"
                                required={true}
                            />

                            <Button
                                className="w-full mt-1"
                                type="submit"
                                loading={isPending}
                                disabled={isButtonDisabled}
                            >
                                {buttonText}
                            </Button>

                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Remember your password?{" "}
                                <Link
                                    to="/login"
                                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </Animated>
        </HomepageComponentCard>
    );
};

export default ForgotPasswordPage;
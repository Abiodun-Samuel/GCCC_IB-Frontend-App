import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

import Message from "@/components/common/Message";
import InputForm from "@/components/form/useForm/InputForm";
import Button from "@/components/ui/Button";
import useGoBack from "@/hooks/useGoBack";
import { BackIcon2 } from "@/icons";
import { useResetPassword } from "@/queries/auth.query";
import { resetPasswordSchema } from "@/schema";
import { Toast } from "@/lib/toastify";
import Animated from "@/components/common/Animated";
import HomepageComponentCard from "@/components/common/HomepageComponentCard";

const ResetPasswordPage = () => {
    const { mutate, isPending, isError, isSuccess, error } = useResetPassword();
    const goBack = useGoBack();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const email = searchParams.get('email');
    const token = searchParams.get('token');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            password_confirmation: ''
        }
    });

    useEffect(() => {
        if (!email || !token) {
            Toast.error('Missing email or token parameters');
            navigate('/forgot-password');
        }
    }, [email, token]);

    const handleResetPassword = useCallback((data) => {
        if (!email || !token) {
            Toast.error('Cannot reset password without email and token');
            return;
        }

        const payload = {
            ...data,
            email,
            token
        };
        mutate(payload, {
            onSuccess: () => {
                reset();
            }
        });
    }, [email, token, mutate, reset]);

    const tagline = useMemo(() => {
        if (email) {
            return `Enter a new password for ${email}`;
        }
        return "Enter your new password below";
    }, [email]);

    const successMessage = useMemo(() => ({
        message: "Password reset successful!",
        details: "You will be redirected to the login page in a few seconds..."
    }), []);

    const isFormValid = !isPending && email && token;

    return (
        <HomepageComponentCard>
            <Animated animation={'zoom-in'} className="flex items-center justify-center px-4">
                <div className="w-full max-w-lg relative">
                    <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-2xl shadow-3xl py-8 px-6 md:p-10 backdrop-blur-sm border-2 border-white/20 dark:border-gray-700/50 transition-all duration-300 hover:shadow-blue-500/10 dark:hover:shadow-blue-400/20 hover:border-white/30 dark:hover:border-gray-600/50">

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
                                    Reset Password
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {tagline}
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
                        <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-5 relative">
                            {/* Success Message */}
                            {isSuccess && (
                                <Message variant="success" data={successMessage} />
                            )}

                            {/* Error Message */}
                            {isError && error && (
                                <Message variant="error" data={error?.data} />
                            )}

                            {/* Missing Parameters Warning */}
                            {(!email || !token) && (
                                <Message
                                    variant="error"
                                    data={{
                                        message: "Invalid reset link",
                                        details: "The password reset link is invalid or has expired. Please request a new one."
                                    }}
                                />
                            )}

                            <div className="relative">
                                <InputForm
                                    label="New Password"
                                    name="password"
                                    type={"password"}
                                    register={register}
                                    error={errors.password?.message}
                                    placeholder="Enter your new password"
                                    required={true}
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="relative">
                                <InputForm
                                    label="Confirm New Password"
                                    name="password_confirmation"
                                    type={"password"}
                                    register={register}
                                    error={errors.password_confirmation?.message}
                                    placeholder="Confirm your new password"
                                    required={true}
                                    autoComplete="new-password"
                                />
                            </div>

                            <Button
                                className="w-full mt-1"
                                type="submit"
                                loading={isPending}
                                disabled={!isFormValid}
                            >
                                {isPending ? "Resetting..." : "Reset Password"}
                            </Button>

                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                <span>Didn't receive the email? </span>
                                <Link
                                    to={`/forgot-password${email ? `?email=${email}` : ''}`}
                                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                >
                                    Request new link
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </Animated>
        </HomepageComponentCard>
    );
};

export default ResetPasswordPage;
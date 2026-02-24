import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import HomepageComponentCard from "@/components/common/HomepageComponentCard";
import Message from "@/components/common/Message";
import InputForm from "@/components/form/useForm/InputForm";
import Button from "@/components/ui/Button";
import useGoBack from "@/hooks/useGoBack";
import { BackIcon2 } from "@/icons";
import { useResetPassword } from "@/queries/auth.query";
import { resetPasswordSchema } from "@/schema";
import { Toast } from "@/lib/toastify";
import { AuthLayout } from "@/pages/Home/Auth/AuthLayout";
import { AuthCard } from "@/pages/Home/Auth/AuthCard";

const B = "#0998d5";

const ResetPasswordPage = () => {
    const { mutate, isPending, isError, isSuccess, error } = useResetPassword();
    const goBack = useGoBack();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const email = searchParams.get("email");
    const token = searchParams.get("token");

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(resetPasswordSchema),
        defaultValues: { password: "", password_confirmation: "" },
    });

    useEffect(() => {
        if (!email || !token) {
            Toast.error("Missing email or token parameters");
            navigate("/forgot-password");
        }
    }, [email, token, navigate]);

    const handleResetPassword = useCallback((data) => {
        if (!email || !token) { Toast.error("Cannot reset password without email and token"); return; }
        mutate({ ...data, email, token }, { onSuccess: () => reset() });
    }, [email, token, mutate, reset]);

    const tagline = useMemo(() =>
        email ? `Setting a new password for ${email}` : "Enter your new password below."
        , [email]);

    const successMessage = useMemo(() => ({
        message: "Password reset successful!",
        details: "You will be redirected to the login page shortly.",
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
                    title="Reset your password"
                    tagline={tagline}
                    backSlot={backButton}
                >
                    <form
                        onSubmit={handleSubmit(handleResetPassword)}
                        noValidate
                        className="flex flex-col gap-5"
                    >
                        {isSuccess && <Message variant="success" data={successMessage} />}
                        {isError && error && <Message variant="error" data={error?.data} />}

                        {(!email || !token) && (
                            <Message
                                variant="error"
                                data={{
                                    message: "Invalid reset link",
                                    details: "This link is invalid or has expired. Please request a new one.",
                                }}
                            />
                        )}

                        <InputForm
                            label="New Password"
                            name="password"
                            type="password"
                            register={register}
                            error={errors.password?.message}
                            placeholder="Enter your new password"
                            required
                            autoComplete="new-password"
                        />

                        <InputForm
                            label="Confirm New Password"
                            name="password_confirmation"
                            type="password"
                            register={register}
                            error={errors.password_confirmation?.message}
                            placeholder="Confirm your new password"
                            required
                            autoComplete="new-password"
                        />

                        <Button
                            className="w-full mt-1"
                            type="submit"
                            loading={isPending}
                            disabled={!(!isPending && email && token)}
                        >
                            {isPending ? "Resetting…" : "Reset Password"}
                        </Button>

                        <p className="text-center text-[13px] text-slate-500 dark:text-slate-400">
                            Didn't receive the email?{" "}
                            <Link
                                to={`/forgot-password${email ? `?email=${email}` : ""}`}
                                className="font-semibold hover:underline underline-offset-2 transition-colors"
                                style={{ color: B }}
                            >
                                Request a new link
                            </Link>
                        </p>
                    </form>
                </AuthCard>
            </AuthLayout>
        </HomepageComponentCard>
    );
};

export default ResetPasswordPage;
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import HomepageComponentCard from "@/components/common/HomepageComponentCard";
import Message from "@/components/common/Message";
import InputForm from "@/components/form/useForm/InputForm";
import Button from "@/components/ui/Button";
import { useLogin } from "@/queries/auth.query";
import { loginSchema } from "@/schema";
import { AuthLayout } from "@/pages/Home/Auth/AuthLayout";
import { AuthCard } from "@/pages/Home/Auth/AuthCard";


const B = "#0998d5";

const LoginPage = () => {
  const { mutate, isPending, isError, error } = useLogin();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const email = watch("email");
  const handleLogin = (data) => {
    mutate(data, {
      onSuccess: () => {
        navigate(redirect, { replace: true });
      }
    });
  };

  return (
    <HomepageComponentCard>
      <AuthLayout>
        <AuthCard
          eyebrow="Member Portal"
          title="Welcome back"
          tagline="Grow deeper in your commitment to God's house."
        >
          <form
            onSubmit={handleSubmit(handleLogin)}
            noValidate
            className="flex flex-col gap-5"
          >
            {isError && error && (
              <Message variant="error" data={error?.data} />
            )}

            <InputForm
              label="Email Address"
              name="email"
              type="email"
              register={register}
              error={errors.email?.message}
              placeholder="you@example.com"
              required
            />

            <InputForm
              label="Password (Phone number)"
              name="password"
              type="password"
              register={register}
              error={errors.password?.message}
              placeholder="Enter your password"
              required
            />

            <Button className="w-full mt-1" type="submit" loading={isPending}>
              Sign In
            </Button>

            <p className="text-center text-[13px] text-slate-500 dark:text-slate-400">
              Can't remember your password?{" "}
              <Link
                to={`/forgot-password?email=${email ?? ""}`}
                className="font-semibold hover:underline underline-offset-2 transition-colors"
                style={{ color: B }}
              >
                Forgot password
              </Link>
            </p>
          </form>
        </AuthCard>
      </AuthLayout>
    </HomepageComponentCard>
  );
};

export default LoginPage;
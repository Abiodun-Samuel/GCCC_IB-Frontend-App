import Animated from "@/components/common/Animated";
import HomepageComponentCard from "@/components/common/HomepageComponentCard";
import Message from "@/components/common/Message";
import InputForm from "@/components/form/useForm/InputForm";
import Button from "@/components/ui/Button";
import { useLogin } from "@/queries/auth.query";
import { loginSchema } from "@/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const TAGLINE = "Grow deeper in your commitment to God's house.";

const LoginPage = () => {
  const { mutate, isPending, isError, error } = useLogin();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const email = watch('email');

  const handleLogin = async (data) => {
    mutate(data);
  }

  return (
    <HomepageComponentCard>
      <Animated animation={'zoom-in'} className="flex items-center justify-center px-4">
        <div className="w-full max-w-lg relative">
          <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-3xl py-8 px-6 md:p-10 backdrop-blur-sm border-2 border-white/20 dark:border-gray-700/50 transition-all duration-300 hover:shadow-blue-500/10 dark:hover:shadow-blue-400/20 hover:border-white/30 dark:hover:border-gray-600/50">

            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 dark:from-blue-400/20 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 dark:from-purple-400/20 to-transparent rounded-tr-full"></div>

            {/* Header Section */}
            <div className="text-center mb-7 relative">
              <div className="space-y-1">
                <Link to='/' className="flex items-center justify-center">
                  <img width={55} src="/images/logo/gccc.png" alt="logo" />
                </Link>
                <h1 className="text-2xl  gap-1 font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
                  Welcome Back
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
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-5 relative">
              {isError && error && (
                <Message variant="error" data={error?.data} />
              )}

              <InputForm
                label="Email"
                name="email"
                type="email"
                register={register}
                error={errors.email?.message}
                placeholder="Enter your email"
                required={true}
              />

              <InputForm
                label="Password (Phone number)"
                name="password"
                type="password"
                register={register}
                error={errors.password?.message}
                placeholder="Enter your password"
                required={true}
              />

              <Button
                className="w-full mt-1"
                type="submit"
                loading={isPending}
              >
                Sign In
              </Button>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                <span>Can't remember your password?  </span>
                <Link
                  to={`/forgot-password?email=${email}`}
                  className="text-red-600 dark:text-red-400 hover:underline font-medium"
                >
                  Forgot password
                </Link>
              </div>
            </form>
          </div>
        </div>
      </Animated>
    </HomepageComponentCard>
  );
};

export default LoginPage;
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import toast from "react-hot-toast";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";

const Login = () => {
  const { signIn, setIsAuthLoading } = useAuthContext();
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  let from = location.state?.from?.pathname || "/";
  from = from?.includes("dashboard") ? "/" : from;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoginLoading(true);
    setLoginError(null);
    const { email, password } = data;

    try {
      const result = await signIn(email, password);
      toast.success(`Welcome back, ${result.user?.name || result.user?.email}!`);
      reset();
      setLoginLoading(false);
      navigate(from, { replace: true });
    } catch (error) {
      setLoginError(error?.error || error?.message || "Login failed");
      setLoginLoading(false);
      setIsAuthLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-center font-body-base pb-24 relative bg-[#F4EADB] text-on-surface">
      <CustomHelmet title={"Sign In"} />

      {/* Decorative ambient background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10 opacity-[0.03] select-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[150px] bg-[#C8A684]"></div>
        <div className="absolute bottom-[0%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px] bg-[#8B6447]"></div>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-[440px] px-5 md:px-0 flex flex-col items-center animate-fade-in">
        {/* Logo Section */}
        <div className="mt-28 mb-16 text-center">
          <Link to="/">
            <img alt="Sri Ram Jewellery" className="h-16 w-auto mx-auto object-contain" src="/logo.png" />
          </Link>
        </div>

        {/* Heading Section */}
        <div className="w-full text-center mb-12">
          <span className="font-display-lg italic text-[14px] text-secondary block mb-2 opacity-80 lowercase tracking-widest">
            Welcome Back
          </span>
          <h1 className="font-display-lg text-headline-md text-on-surface">
            Sign In
          </h1>
        </div>

        {/* Error notification */}
        {loginError && (
          <div className="w-full mb-6 p-4 bg-error-container text-on-error-container text-sm font-semibold flex items-center gap-2 animate-fade-in-up">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>{loginError}</span>
          </div>
        )}

        {/* Form Section */}
        <form className="w-full space-y-10" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div className="input-focus-line">
            <label className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-[0.2em] mb-2 block" htmlFor="login-email">
              Email Address
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-[#C8A684] py-3 px-0 focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 transition-all duration-300 outline-none focus:border-primary font-body-base"
              id="login-email"
              placeholder="Enter your email"
              type="email"
              {...register("email", { required: true })}
            />
            {errors.email && <span className="text-error text-xs mt-1 block font-semibold">Email is required</span>}
          </div>

          {/* Password Field */}
          <div className="space-y-3">
            <div className="input-focus-line">
              <label className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-[0.2em] mb-2 block" htmlFor="login-password">
                Password
              </label>
              <input
                className="w-full bg-transparent border-0 border-b border-[#C8A684] py-3 px-0 focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 transition-all duration-300 outline-none focus:border-primary font-body-base tracking-widest"
                id="login-password"
                placeholder="••••••••"
                type="password"
                {...register("password", { required: true })}
              />
              {errors.password && <span className="text-error text-xs mt-1 block font-semibold">Password is required</span>}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-6">
            <button
              className="w-full bg-[#8B6447] text-white py-5 font-button-text uppercase tracking-[0.2em] text-[12px] hover:bg-primary transition-all duration-500 transform hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100 disabled:hover:bg-primary cursor-pointer"
              type="submit"
              disabled={loginLoading}
            >
              {loginLoading ? <span className="loading loading-spinner loading-md"></span> : "Sign In"}
            </button>
          </div>
        </form>

        {/* Registration Link */}
        <div className="mt-16 text-center">
          <p className="font-body-base text-[14px] text-on-surface-variant">
            Don't have an account?
            <Link className="text-primary font-semibold underline underline-offset-8 hover:text-secondary transition-colors duration-300 ml-1" to="/register">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;

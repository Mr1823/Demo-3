import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuthContext from "../../hooks/useAuthContext";
import toast from "react-hot-toast";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";

const Register = () => {
  const { signUp, setIsAuthLoading } = useAuthContext();
  const [registerError, setRegisterError] = useState(null);
  const [registerLoading, setRegisterLoading] = useState(false);

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
    setRegisterLoading(true);
    setRegisterError(null);
    const { name, email, password } = data;

    try {
      const result = await signUp(name, email, password);
      toast.success("Registration successful! Welcome aboard.");
      reset();
      setRegisterLoading(false);
      navigate(from, { replace: true });
    } catch (error) {
      setRegisterError(error?.error || error?.message || "Registration failed");
      setRegisterLoading(false);
      setIsAuthLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-section-gap-lg px-margin-mobile relative bg-surface text-on-surface">
      <CustomHelmet title={"Register"} />

      {/* Decorative ambient background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10 opacity-[0.03] select-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[150px] bg-[#C8A684]"></div>
        <div className="absolute bottom-[0%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] bg-[#8B6447]"></div>
      </div>

      <div className="w-full max-w-[480px] animate-fade-in-up">
        {/* Header */}
        <header className="text-center mb-16">
          <Link to="/" className="inline-block mb-8">
            <img alt="Sri Ram Jewellery" className="h-16 w-auto mx-auto object-contain" src="/logo.png" />
          </Link>
          <p className="font-label-caps text-label-caps text-primary mb-6 tracking-[0.3em] uppercase">Private Registry</p>
          <h1 className="font-display-lg text-display-lg-mobile md:text-[64px] text-on-surface leading-tight tracking-tight drop-shadow-sm">Create Account</h1>
          <div className="w-12 h-[1px] bg-primary mx-auto mt-8 opacity-40"></div>
        </header>

        {/* Error */}
        {registerError && (
          <div className="w-full mb-6 p-4 bg-error-container text-on-error-container text-sm font-semibold flex items-center gap-2 animate-fade-in-up">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>{registerError}</span>
          </div>
        )}

        {/* Form */}
        <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div className="relative group">
            <label className="font-label-caps text-label-caps text-on-surface-variant/80 block mb-1 transition-colors group-focus-within:text-primary" htmlFor="reg-name">Full Name</label>
            <input
              className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface placeholder:text-outline-variant/40 transition-all duration-300 outline-none focus:border-primary font-body-base"
              id="reg-name"
              placeholder="E.g. Arjun Mehta"
              type="text"
              {...register("name", { required: true })}
            />
            {errors.name && <span className="text-error text-xs mt-1 block font-semibold">Name is required</span>}
          </div>

          {/* Email Field */}
          <div className="relative group">
            <label className="font-label-caps text-label-caps text-on-surface-variant/80 block mb-1 transition-colors group-focus-within:text-primary" htmlFor="reg-email">Email Address</label>
            <input
              className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface placeholder:text-outline-variant/40 transition-all duration-300 outline-none focus:border-primary font-body-base"
              id="reg-email"
              placeholder="email@example.com"
              type="email"
              {...register("email", { required: true })}
            />
            {errors.email && <span className="text-error text-xs mt-1 block font-semibold">Email is required</span>}
          </div>

          {/* Password Field */}
          <div className="relative group">
            <label className="font-label-caps text-label-caps text-on-surface-variant/80 block mb-1 transition-colors group-focus-within:text-primary" htmlFor="reg-password">Security Password</label>
            <input
              className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface placeholder:text-outline-variant/40 transition-all duration-300 outline-none focus:border-primary font-body-base tracking-widest"
              id="reg-password"
              placeholder="••••••••"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
            />
            {errors.password && <span className="text-error text-xs mt-1 block font-semibold">{errors.password.message}</span>}
          </div>

          {/* Action Button */}
          <div className="pt-8">
            <button
              className="w-full py-6 bg-primary-container text-white font-button-text uppercase tracking-[0.2em] hover:bg-primary transition-all duration-700 shadow-xl shadow-primary-container/10 group overflow-hidden relative flex items-center justify-center disabled:opacity-70 disabled:hover:bg-primary-container cursor-pointer"
              type="submit"
              disabled={registerLoading}
            >
              <span className="relative z-10 flex items-center gap-2">
                {registerLoading ? <span className="loading loading-spinner loading-md"></span> : "Create Account"}
              </span>
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <footer className="mt-16 text-center">
          <p className="font-body-base text-[14px] text-on-surface-variant">
            Already part of the heritage?
            <Link className="text-primary font-semibold underline underline-offset-8 hover:text-secondary transition-colors duration-300 ml-2" to="/login">Sign In</Link>
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Register;

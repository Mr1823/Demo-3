import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuthContext from "../../hooks/useAuthContext";
import toast from "react-hot-toast";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDPsFrWztD4iPFFVXzCkBPEfyBStgI3PNvxZHYaG2xk_d1nosHS5vyaq9K_uwZdvntEmcJtGPU1Q9IA6MPJTJaKdJ7LkmxSMEQrro0eYkE0QP6KpW6K7_x_F3poPHVg_ZM6jrDlVagpaUF05lVzfr2CGrOvwLpgVfi2zeH7r94YoPzdWIuVUMZ79DrWDv5Z6ZJDZvBFhl3pZh_ucp_8E0fVJ3FrcM7qv-4etClKOvw7wgmsTNnARVdj6aoukBw790ysmQkfJORH8YM";

const Register = () => {
  const { signUp } = useAuthContext();
  const [registerError, setRegisterError] = useState(null);
  const [registerLoading, setRegisterLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  let from = location.state?.from?.pathname || "/";
  from = from?.includes("dashboard") ? "/" : from;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setRegisterLoading(true);
    setRegisterError(null);
    try {
      await signUp(data.name, data.email, data.password);
      toast.success("Welcome to the heritage! Your account has been created.");
      navigate(from, { replace: true });
    } catch (error) {
      setRegisterError(error?.error || error?.message || "Registration failed");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex font-body-base bg-surface text-on-surface">
      <CustomHelmet title="Sign Up" />

      {/* Left: Editorial image panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30"></div>
        <div className="relative z-10 flex flex-col justify-between h-full p-16 text-white">
          <span className="font-label-caps text-label-caps tracking-[0.3em] uppercase opacity-90">
            Timeless Craftsmanship
          </span>
          <h2 className="font-display-lg text-headline-md leading-tight max-w-md">
            Since generations, we have been crafting stories in gold and precious stones. Join our
            circle of Heritage.
          </h2>
        </div>
      </div>

      {/* Right: Form panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-20 md:px-16">
        <div className="w-full max-w-[400px]">
          <div className="text-center mb-10">
            <Link to="/">
              <img
                alt="Sri Ram Jewellery"
                className="h-14 w-auto mx-auto object-contain mb-6"
                src="/logo.png"
              />
            </Link>
            <h1 className="font-display-lg text-headline-md text-on-surface mb-2">Join the Heritage</h1>
            <p className="font-body-base text-on-surface-variant text-sm">
              Create an account to start your journey with us
            </p>
          </div>

          {registerError && (
            <div className="w-full mb-6 p-4 bg-error-container text-on-error-container text-sm font-semibold flex items-center gap-2 animate-fade-in-up">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span>{registerError}</span>
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-[0.2em] mb-2 block"
                htmlFor="reg-name"
              >
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                placeholder="E.g. Arjun Mehta"
                className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 transition-all duration-300 outline-none focus:border-primary font-body-base"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <span className="text-error text-xs mt-1 block font-semibold">Name is required</span>
              )}
            </div>

            <div>
              <label
                className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-[0.2em] mb-2 block"
                htmlFor="reg-email"
              >
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                placeholder="yourname@example.com"
                className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 transition-all duration-300 outline-none focus:border-primary font-body-base"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className="text-error text-xs mt-1 block font-semibold">Email is required</span>
              )}
            </div>

            <div>
              <label
                className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-[0.2em] mb-2 block"
                htmlFor="reg-password"
              >
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 transition-all duration-300 outline-none focus:border-primary font-body-base tracking-widest"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              {errors.password && (
                <span className="text-error text-xs mt-1 block font-semibold">
                  {errors.password.message}
                </span>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary mt-0.5"
                {...register("subscribeNewsletter")}
              />
              <span className="font-body-base text-xs text-on-surface-variant leading-relaxed">
                Subscribe to our newsletter for exclusive collections and private viewings.
              </span>
            </label>

            <div className="pt-4">
              <button
                type="submit"
                disabled={registerLoading}
                className="w-full bg-primary text-white py-4 md:py-5 font-button-text uppercase tracking-[0.2em] text-[12px] hover:bg-primary-container transition-all duration-500 transform hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100 disabled:hover:bg-primary cursor-pointer"
              >
                {registerLoading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          <p className="text-center mt-8 font-body-base text-sm text-on-surface-variant">
            Already have an account?{" "}
            <Link
              to="/login"
              state={{ from: location }}
              className="text-primary font-semibold hover:text-secondary transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;

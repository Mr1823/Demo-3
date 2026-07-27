import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuthContext from "../../hooks/useAuthContext";
import toast from "react-hot-toast";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";

const Register = () => {
  const { createUser, signInGoogle, updateUserProfile, setIsAuthLoading } = useAuthContext();
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

  const onSubmit = (data) => {
    setRegisterLoading(true);
    const { name, email, password } = data;

    createUser(email, password)
      .then((res) => {
        updateUserProfile(name)
          .then(() => {
            const saveUser = { name: res.user.displayName, email: res.user.email };
            fetch(`${import.meta.env.VITE_API_URL}/users`, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(saveUser),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.insertedId) {
                  reset();
                  toast.success("Registration is successful");
                  setRegisterLoading(false);
                  navigate(from, { replace: true });
                }
              });
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        setRegisterError(error.code);
        setRegisterLoading(false);
        setIsAuthLoading(false);
      });
  };

  const handleGoogleSignIn = () => {
    signInGoogle()
      .then((res) => {
        const saveUser = { name: res.user.displayName, email: res.user.email };
        fetch(`${import.meta.env.VITE_API_URL}/users`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(saveUser),
        })
          .then((res) => res.json())
          .then((data) => {
             toast.success("Successfully logged in");
             navigate(from, { replace: true });
          });
      })
      .catch((error) => {
        setIsAuthLoading(false);
        setRegisterError(error?.code);
      });
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
            <span>Error: {registerError.replace("auth/", "")}</span>
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
              {...register("password", { required: true })}
            />
            {errors.password && <span className="text-error text-xs mt-1 block font-semibold">Password is required</span>}
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

        {/* Divider */}
        <div className="flex items-center gap-6 my-12 before:flex-1 before:border-t before:border-outline-variant/30 after:flex-1 after:border-t after:border-outline-variant/30">
          <span className="font-label-caps text-[10px] text-outline-variant tracking-widest uppercase">Social Entry</span>
        </div>

        {/* Social Sign-Up */}
        <div className="space-y-4">
          <button
            className="w-full py-5 border border-outline-variant flex items-center justify-center gap-4 font-button-text text-on-surface-variant hover:bg-surface-container-low transition-all duration-500 group cursor-pointer"
            type="button"
            onClick={handleGoogleSignIn}
          >
            <svg className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Continue with Google
          </button>
        </div>

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

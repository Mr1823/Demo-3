import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import toast from "react-hot-toast";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";
import { getFriendlyAuthErrorMessage } from "../../utils/authErrors";

const Login = () => {
  const { signIn, signInGoogle, setIsAuthLoading, resetPassword } = useAuthContext();
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Forgot Password State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);

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
    setLoginLoading(true);
    setLoginError(null);
    const { email, password } = data;

    signIn(email, password)
      .then((res) => {
        toast.success(`Authenticated as ${res.user?.email}`);
        reset();
        setLoginLoading(false);
        navigate(from, { replace: true });
      })
      .catch((error) => {
        setLoginError(error?.code);
        setLoginLoading(false);
        setIsAuthLoading(false);
      });
  };

  const handleGoogleSignIn = () => {
    setLoginError(null);
    signInGoogle()
      .then((res) => {
        toast.success(`Authenticated as ${res.user?.email}`);
        navigate(from, { replace: true });
      })
      .catch((error) => {
        setIsAuthLoading(false);
        setLoginError(error?.code);
      });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetError("Please enter your email address.");
      return;
    }
    setResetLoading(true);
    setResetError(null);
    
    resetPassword(resetEmail)
      .then(() => {
        setResetSuccess(true);
        setResetLoading(false);
        setTimeout(() => {
          setIsForgotModalOpen(false);
          setResetSuccess(false);
          setResetEmail("");
        }, 3000);
      })
      .catch((error) => {
        setResetError(error?.code);
        setResetLoading(false);
      });
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
            <span>{getFriendlyAuthErrorMessage(loginError)}</span>
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
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => setIsForgotModalOpen(true)}
                className="font-body-base text-[12px] text-on-surface-variant/70 hover:text-primary transition-colors duration-300 cursor-pointer"
              >
                Forgot Password?
              </button>
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

          {/* Divider */}
          <div className="relative flex items-center justify-center py-4">
            <div className="w-full border-t border-[#C8A684]/30"></div>
            <span className="absolute bg-[#F4EADB] px-6 font-label-caps text-[10px] text-on-surface-variant/60 tracking-[0.25em]">OR</span>
          </div>

          {/* Social Login */}
          <button
            className="w-full bg-transparent border border-[#C8A684] text-on-surface py-4 flex items-center justify-center gap-4 font-button-text uppercase tracking-[0.15em] text-[11px] hover:bg-surface-container-low transition-all duration-500 group cursor-pointer"
            type="button"
            onClick={handleGoogleSignIn}
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Continue with Google
          </button>
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

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#F4EADB] border border-primary/20 max-w-md w-full p-8 shadow-2xl relative animate-fade-in-up">
            <button 
              onClick={() => {
                setIsForgotModalOpen(false);
                setResetError(null);
                setResetSuccess(false);
              }}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-display-lg text-headline-sm text-primary mb-2">Reset Password</h3>
            
            {resetSuccess ? (
              <div className="mt-6 p-4 bg-success-sage/10 text-[#4CAF50] text-sm text-center">
                <span className="material-symbols-outlined text-[32px] mb-2">mark_email_read</span>
                <p>Password reset link has been sent to your email.</p>
              </div>
            ) : (
              <>
                <p className="font-body-base text-sm text-on-surface-variant mb-6">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                
                {resetError && (
                  <div className="w-full mb-6 p-3 bg-error-container/20 text-error text-xs font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    <span>{getFriendlyAuthErrorMessage(resetError)}</span>
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="input-focus-line">
                    <label className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-[0.2em] mb-2 block">Email Address *</label>
                    <input 
                      required 
                      type="email" 
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-[#C8A684] py-3 px-0 focus:ring-0 text-on-surface transition-all duration-300 outline-none focus:border-primary font-body-base" 
                      placeholder="e.g. aditya@example.com" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={resetLoading}
                    className="w-full bg-[#8B6447] text-white py-4 font-button-text text-[12px] font-bold tracking-widest hover:bg-primary transition-colors uppercase mt-4 cursor-pointer disabled:opacity-70 disabled:hover:bg-[#8B6447]"
                  >
                    {resetLoading ? <span className="loading loading-spinner loading-sm"></span> : "Send Reset Link"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Login;

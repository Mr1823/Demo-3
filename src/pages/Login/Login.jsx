import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import { getApiBaseUrl } from "../../utils/apiConfig";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";

const Login = () => {
  const { requestOtp, verifyOtp, setIsAuthLoading, getAccessToken } = useAuthContext();
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  
  // step 1 = phone entry, step 2 = OTP entry, step 3 = name collection (first-time users)
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verifiedUser, setVerifiedUser] = useState(null);

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

  // Normalize phone: auto-prepend +91 if user types 10 digits without prefix
  const normalizePhone = (phone) => {
    const cleaned = phone.replace(/\s+/g, "");
    if (/^\d{10}$/.test(cleaned)) {
      return "+91" + cleaned;
    }
    if (/^91\d{10}$/.test(cleaned)) {
      return "+" + cleaned;
    }
    return cleaned;
  };

  const onRequestOtp = async (data) => {
    setLoginLoading(true);
    setLoginError(null);
    const phone = normalizePhone(data.phone);

    try {
      await requestOtp(phone);
      setPhoneNumber(phone);
      setStep(2);
      reset();
      toast.success("OTP sent to your phone");
    } catch (error) {
      setLoginError(error?.error || error?.message || "Failed to request OTP");
    } finally {
      setLoginLoading(false);
    }
  };

  const onVerifyOtp = async (data) => {
    setLoginLoading(true);
    setLoginError(null);
    const { otp } = data;

    try {
      const result = await verifyOtp(phoneNumber, otp);
      reset();

      // If user has no name, prompt for it (first-time user)
      if (!result.user?.name) {
        setVerifiedUser(result.user);
        setStep(3);
      } else {
        toast.success(`Welcome, ${result.user.name}!`);
        navigate(from, { replace: true });
      }
    } catch (error) {
      setLoginError(error?.error || error?.message || "Invalid OTP");
      setIsAuthLoading(false);
    } finally {
      setLoginLoading(false);
    }
  };

  const onSaveName = async (data) => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      const token = getAccessToken();
      await axios.patch(
        `${getApiBaseUrl()}/users/me`,
        { name: data.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Welcome, ${data.name}!`);
      navigate(from, { replace: true });
    } catch (error) {
      setLoginError(error?.response?.data?.error || "Failed to save name");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleResend = async () => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      await requestOtp(phoneNumber);
      toast.success("OTP resent successfully");
    } catch (error) {
      setLoginError(error?.error || error?.message || "Failed to resend OTP");
    } finally {
      setLoginLoading(false);
    }
  };

  const stepHeadings = {
    1: { eyebrow: "Welcome", title: "Sign In" },
    2: { eyebrow: "Verification", title: "Enter OTP" },
    3: { eyebrow: "Almost There", title: "What's Your Name?" },
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-center font-body-base pb-24 relative bg-surface text-on-surface">
      <CustomHelmet title={"Sign In"} />

      {/* Decorative ambient background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10 opacity-[0.03] select-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[150px] bg-primary-container"></div>
        <div className="absolute bottom-[0%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px] bg-primary"></div>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-[440px] px-5 md:px-0 flex flex-col items-center animate-fade-in">
        {/* Logo Section */}
        <div className="mt-16 md:mt-28 mb-12 md:mb-16 text-center">
          <Link to="/">
            <img alt="Sri Ram Jewellery" className="h-16 w-auto mx-auto object-contain" src="/logo.png" />
          </Link>
        </div>

        {/* Heading Section */}
        <div className="w-full text-center mb-12">
          <span className="font-display-lg italic text-[14px] text-secondary block mb-2 opacity-80 lowercase tracking-widest">
            {stepHeadings[step].eyebrow}
          </span>
          <h1 className="font-display-lg text-headline-md text-on-surface">
            {stepHeadings[step].title}
          </h1>
        </div>

        {/* Error notification */}
        {loginError && (
          <div className="w-full mb-6 p-4 bg-error-container text-on-error-container text-sm font-semibold flex items-center gap-2 animate-fade-in-up">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>{loginError}</span>
          </div>
        )}

        {/* ─── Step 1: Phone Number ─── */}
        {step === 1 && (
          <form className="w-full space-y-10" onSubmit={handleSubmit(onRequestOtp)}>
            <div className="input-focus-line">
              <label className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-[0.2em] mb-2 block" htmlFor="login-phone">
                Mobile Number
              </label>
              <div className="flex items-center gap-3">
                <span className="text-on-surface-variant font-body-base text-base border-b border-outline-variant py-3 select-none">+91</span>
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 transition-all duration-300 outline-none focus:border-primary font-body-base tracking-widest"
                  id="login-phone"
                  placeholder="98765 43210"
                  type="tel"
                  maxLength={10}
                  {...register("phone", {
                    required: true,
                    pattern: /^[\+]?[0-9]{10,15}$/,
                  })}
                />
              </div>
              {errors.phone && <span className="text-error text-xs mt-1 block font-semibold">Enter a valid 10-digit mobile number</span>}
            </div>

            <div className="pt-6">
              <button
                className="w-full bg-primary text-white py-4 md:py-5 font-button-text uppercase tracking-[0.2em] text-[12px] hover:bg-primary-container transition-all duration-500 transform hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100 disabled:hover:bg-primary cursor-pointer"
                type="submit"
                disabled={loginLoading}
              >
                {loginLoading ? <span className="loading loading-spinner loading-md"></span> : "Send OTP"}
              </button>
            </div>
          </form>
        )}

        {/* ─── Step 2: OTP Verification ─── */}
        {step === 2 && (
          <form className="w-full space-y-10" onSubmit={handleSubmit(onVerifyOtp)}>
            <div className="input-focus-line text-center">
              <label className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-[0.2em] mb-2 block" htmlFor="login-otp">
                6-Digit OTP sent to {phoneNumber}
              </label>
              <input
                className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 transition-all duration-300 outline-none focus:border-primary font-body-base tracking-[1em] text-center text-xl"
                id="login-otp"
                placeholder="------"
                type="text"
                maxLength={6}
                {...register("otp", { required: true, minLength: 6, maxLength: 6 })}
              />
              {errors.otp && <span className="text-error text-xs mt-1 block font-semibold">Enter a valid 6-digit OTP</span>}
            </div>

            <div className="pt-6 flex flex-col gap-4">
              <button
                className="w-full bg-primary text-white py-4 md:py-5 font-button-text uppercase tracking-[0.2em] text-[12px] hover:bg-primary-container transition-all duration-500 transform hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100 disabled:hover:bg-primary cursor-pointer"
                type="submit"
                disabled={loginLoading}
              >
                {loginLoading ? <span className="loading loading-spinner loading-md"></span> : "Verify & Sign In"}
              </button>
              
              <button
                type="button"
                onClick={handleResend}
                disabled={loginLoading}
                className="text-on-surface-variant font-label-caps text-[10px] uppercase tracking-widest hover:text-primary transition-colors cursor-pointer"
              >
                Resend OTP
              </button>
              
              <button
                type="button"
                onClick={() => { setStep(1); reset(); setLoginError(null); }}
                disabled={loginLoading}
                className="text-on-surface-variant font-label-caps text-[10px] uppercase tracking-widest hover:text-primary transition-colors cursor-pointer"
              >
                Change Phone Number
              </button>
            </div>
          </form>
        )}

        {/* ─── Step 3: Name Collection (first-time users) ─── */}
        {step === 3 && (
          <form className="w-full space-y-10" onSubmit={handleSubmit(onSaveName)}>
            <div className="input-focus-line">
              <label className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-[0.2em] mb-2 block" htmlFor="login-name">
                Your Name
              </label>
              <input
                className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 transition-all duration-300 outline-none focus:border-primary font-body-base"
                id="login-name"
                placeholder="Enter your full name"
                type="text"
                {...register("name", { required: true, minLength: 2 })}
              />
              {errors.name && <span className="text-error text-xs mt-1 block font-semibold">Name is required (min 2 characters)</span>}
            </div>

            <div className="pt-6 flex flex-col gap-4">
              <button
                className="w-full bg-primary text-white py-4 md:py-5 font-button-text uppercase tracking-[0.2em] text-[12px] hover:bg-primary-container transition-all duration-500 transform hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100 disabled:hover:bg-primary cursor-pointer"
                type="submit"
                disabled={loginLoading}
              >
                {loginLoading ? <span className="loading loading-spinner loading-md"></span> : "Continue"}
              </button>
              
              <button
                type="button"
                onClick={() => { navigate(from, { replace: true }); }}
                className="text-on-surface-variant font-label-caps text-[10px] uppercase tracking-widest hover:text-primary transition-colors cursor-pointer"
              >
                Skip for Now
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
};

export default Login;

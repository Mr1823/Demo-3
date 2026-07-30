import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthContext from "./useAuthContext";
import { getApiBaseUrl } from "../utils/apiConfig";

// Shared phone + OTP state machine used by both the Login and Register pages
// (OTP verification transparently creates the account on first use, so both
// pages ultimately drive the same 3-step flow: phone -> OTP -> name).
const usePhoneAuthFlow = () => {
  const { requestOtp, verifyOtp, setIsAuthLoading, getAccessToken } = useAuthContext();
  const [step, setStep] = useState(1); // 1 = phone entry, 2 = OTP entry, 3 = name collection
  const [phoneNumber, setPhoneNumber] = useState("");
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

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

  const normalizePhone = (phone) => {
    const cleaned = phone.replace(/\s+/g, "");
    if (/^\d{10}$/.test(cleaned)) return "+91" + cleaned;
    if (/^91\d{10}$/.test(cleaned)) return "+" + cleaned;
    return cleaned;
  };

  const onRequestOtp = async (data) => {
    setAuthLoading(true);
    setAuthError(null);
    const phone = normalizePhone(data.phone);

    try {
      await requestOtp(phone);
      setPhoneNumber(phone);
      setStep(2);
      reset();
      toast.success("OTP sent to your phone");
    } catch (error) {
      setAuthError(error?.error || error?.message || "Failed to request OTP");
    } finally {
      setAuthLoading(false);
    }
  };

  const onVerifyOtp = async (data) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const result = await verifyOtp(phoneNumber, data.otp);
      reset();

      if (!result.user?.name) {
        setStep(3);
      } else {
        toast.success(`Welcome, ${result.user.name}!`);
        navigate(from, { replace: true });
      }
    } catch (error) {
      setAuthError(error?.error || error?.message || "Invalid OTP");
      setIsAuthLoading(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const onSaveName = async (data) => {
    setAuthLoading(true);
    setAuthError(null);
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
      setAuthError(error?.response?.data?.error || "Failed to save name");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResend = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await requestOtp(phoneNumber);
      toast.success("OTP resent successfully");
    } catch (error) {
      setAuthError(error?.error || error?.message || "Failed to resend OTP");
    } finally {
      setAuthLoading(false);
    }
  };

  const goBackToPhone = () => {
    setStep(1);
    reset();
    setAuthError(null);
  };

  return {
    step,
    phoneNumber,
    authError,
    authLoading,
    register,
    handleSubmit,
    errors,
    onRequestOtp,
    onVerifyOtp,
    onSaveName,
    handleResend,
    goBackToPhone,
  };
};

export default usePhoneAuthFlow;

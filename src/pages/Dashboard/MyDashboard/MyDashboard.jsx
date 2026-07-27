import React, { useState, useEffect } from "react";
import useUserInfo from "../../../hooks/useUserInfo";
import useAuthContext from "../../../hooks/useAuthContext";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyDashboard = () => {
  const [userFromDB, , refetch] = useUserInfo();
  const { user } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();
  const [updateUserDetails, setUpdateUserDetails] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (userFromDB && updateUserDetails) {
      reset({
        fullName: userFromDB?.name || user?.displayName || "",
        mobileNumber: userFromDB?.mobileNumber || "",
        gender: userFromDB?.gender || "",
        dob: userFromDB?.dob || "",
        location: userFromDB?.location || ""
      });
    }
  }, [userFromDB, user, updateUserDetails, reset]);

  const onSubmit = (data) => {
    const { fullName, mobileNumber, gender, dob, location } = data;

    axiosSecure
      .patch(`/update-user?email=${userFromDB?.email}`, {
        fullName,
        mobileNumber: mobileNumber || undefined,
        gender: gender || undefined,
        dob: dob || undefined,
        location: location || undefined,
      })
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          setUpdateUserDetails(false);
          refetch();
        }
      })
      .catch((e) => console.error(e));
  };

  return (
    <div className="w-full">
      <header className="mb-12">
        <span className="font-body text-[12px] font-semibold text-secondary tracking-[0.2em] uppercase block mb-2">
          Your Account
        </span>
        <h1 className="font-display text-5xl md:text-6xl text-primary">Overview</h1>
      </header>

      {!updateUserDetails ? (
        <div className="bg-surface-container-low border border-outline-gold/30 p-8 max-w-2xl relative group">
          <div className="absolute top-8 right-8">
            <button
              onClick={() => setUpdateUserDetails(true)}
              className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              aria-label="Edit Profile"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
            </button>
          </div>

          <div className="flex items-center gap-6 mb-10 pb-10 border-b border-primary/10">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 bg-surface-variant">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary text-white font-display text-4xl">
                  {userFromDB?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h2 className="font-display text-3xl text-on-surface mb-1">
                {userFromDB?.name || user?.displayName}
              </h2>
              <p className="font-body text-sm text-on-surface-variant">
                Member since {new Date(user?.metadata?.creationTime || Date.now()).getFullYear()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-10">
            <div>
              <span className="font-body text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest block mb-1">
                Email Address
              </span>
              <p className="font-body text-sm text-on-surface">{userFromDB?.email}</p>
            </div>

            <div>
              <span className="font-body text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest block mb-1">
                Mobile Number
              </span>
              <p className="font-body text-sm text-on-surface">
                {userFromDB?.mobileNumber ? `+${userFromDB.mobileNumber}` : <span className="italic text-on-surface-variant/70">Not added</span>}
              </p>
            </div>

            <div>
              <span className="font-body text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest block mb-1">
                Gender
              </span>
              <p className="font-body text-sm text-on-surface capitalize">
                {userFromDB?.gender || <span className="italic text-on-surface-variant/70">Not added</span>}
              </p>
            </div>

            <div>
              <span className="font-body text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest block mb-1">
                Date of Birth
              </span>
              <p className="font-body text-sm text-on-surface">
                {userFromDB?.dob ? new Date(userFromDB.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : <span className="italic text-on-surface-variant/70">Not added</span>}
              </p>
            </div>

            <div className="md:col-span-2">
              <span className="font-body text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest block mb-1">
                Location
              </span>
              <p className="font-body text-sm text-on-surface leading-relaxed">
                {userFromDB?.location || <span className="italic text-on-surface-variant/70">Not added</span>}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-low border border-outline-gold/30 p-8 max-w-2xl animate-fade-in">
          <div className="flex justify-between items-center mb-8 border-b border-primary/10 pb-4">
            <h4 className="font-display text-2xl text-primary">Edit Profile</h4>
            <button 
              onClick={() => setUpdateUserDetails(false)}
              className="text-on-surface-variant hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="input-focus-line">
              <label className="font-body text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] mb-2 block">Full Name</label>
              <input
                type="text"
                className="w-full bg-transparent border-0 border-b border-secondary py-3 px-0 focus:ring-0 text-on-surface transition-all duration-300 outline-none focus:border-primary font-body"
                {...register("fullName", { required: true })}
              />
              {errors.fullName && <span className="text-error text-xs italic mt-1 block">Required</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="input-focus-line">
                <label className="font-body text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] mb-2 block">Mobile Number</label>
                <input
                  type="text"
                  placeholder="e.g. 919876543210"
                  className="w-full bg-transparent border-0 border-b border-secondary py-3 px-0 focus:ring-0 text-on-surface transition-all duration-300 outline-none focus:border-primary font-body"
                  {...register("mobileNumber")}
                />
              </div>

              <div className="input-focus-line">
                <label className="font-body text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] mb-2 block">Date of Birth</label>
                <input
                  type="date"
                  className="w-full bg-transparent border-0 border-b border-secondary py-3 px-0 focus:ring-0 text-on-surface transition-all duration-300 outline-none focus:border-primary font-body"
                  {...register("dob")}
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="font-body text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] mb-4 block">Gender</label>
              <div className="flex gap-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    value="male"
                    className="w-4 h-4 text-primary bg-transparent border-outline-variant focus:ring-primary focus:ring-2"
                    {...register("gender")}
                  />
                  <span className="font-body text-sm text-on-surface group-hover:text-primary transition-colors">Male</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    value="female"
                    className="w-4 h-4 text-primary bg-transparent border-outline-variant focus:ring-primary focus:ring-2"
                    {...register("gender")}
                  />
                  <span className="font-body text-sm text-on-surface group-hover:text-primary transition-colors">Female</span>
                </label>
              </div>
            </div>

            <div className="input-focus-line pt-2">
              <label className="font-body text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] mb-2 block">Location</label>
              <textarea
                rows={3}
                placeholder="Tell us about your location"
                className="w-full bg-transparent border-0 border-b border-secondary py-3 px-0 focus:ring-0 text-on-surface transition-all duration-300 outline-none focus:border-primary font-body resize-none"
                {...register("location")}
              />
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                className="px-10 py-4 bg-primary text-white font-body text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary/90 transition-all duration-300 cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyDashboard;

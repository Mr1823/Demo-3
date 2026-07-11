import React, { useState } from "react";
import "./MyDashboard.css";
import useUserInfo from "../../../hooks/useUserInfo";
import useAuthContext from "../../../hooks/useAuthContext";
import { FaPencil } from "react-icons/fa6";
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
    formState: { errors },
  } = useForm();

  // handle form data
  const onSubmit = (data) => {
    const { fullName, mobileNumber, gender, dob, location } = data;

    // update user data
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
    <div className="">
      <div className="pb-6 border-b">
        <h1 className="text-4xl font-semibold">Profile Details</h1>
      </div>

      <>
        {!updateUserDetails ? (
          <div className="mt-8 profile-details-con space-y-7 mb-10">
            <div>
              <h6>Profile Picture</h6>
              <div className="gradient-shadow">
                <img src={user?.photoURL} alt={user?.displayName} />
              </div>
            </div>

            <div>
              <h6>Full Name</h6>
              <h6>{user?.displayName}</h6>
            </div>

            <div>
              <h6>Email</h6>
              <h6>{userFromDB?.email}</h6>
            </div>

            <div>
              <h6>Mobile Number</h6>
              <h6>
                {userFromDB?.mobileNumber
                  ? `+${userFromDB.mobileNumber}`
                  : "- not added -"}
              </h6>
            </div>

            <div>
              <h6>Gender</h6>
              <h6>{userFromDB?.gender?.toUpperCase() || "- not added -"}</h6>
            </div>

            <div>
              <h6>Date of Birth</h6>
              <h6>{userFromDB?.dob || "- not added -"}</h6>
            </div>

            <div>
              <h6>Location</h6>
              <h6>{userFromDB?.location || "- not added -"}</h6>
            </div>

            <button
              className="btn btn-outline btn-wide"
              onClick={() => setUpdateUserDetails(true)}
            >
              <FaPencil /> Edit
            </button>
          </div>
        ) : (
          <div className="mt-8 mb-10">
            <form onSubmit={handleSubmit(onSubmit)} className="address-form">
              <div>
                <p>Full Name *</p>
                <input
                  type="text"
                  {...register("fullName", { required: true })}
                />
                {errors.fullName && (
                  <span className="text-red-400">Your Name is required</span>
                )}
              </div>
              <div>
                <p>Mobile Number</p>
                <input
                  type="number"
                  {...register("mobileNumber")}
                  placeholder="e.g +1 xxx-xxx"
                />
              </div>
              <div>
                <p className="mb-4">Gender</p>

                <div className="flex items-center gap-5">
                  <label
                    htmlFor="male"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id="male"
                      value={"male"}
                      className="radio radio-primary scale-75"
                      {...register("gender")}
                    />
                    <span className="text-lg">Male</span>
                  </label>
                  <label
                    htmlFor="female"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id="female"
                      value={"female"}
                      className="radio radio-primary scale-75"
                      {...register("gender")}
                    />
                    <span className="text-lg">Female</span>
                  </label>
                </div>
              </div>
              <div>
                <p>Date of Birth</p>
                <input type="date" {...register("dob")} />
              </div>
              <div>
                <p>Location</p>
                <textarea
                  {...register("location")}
                  rows={3}
                  className="w-full border-2 border-black outline-none rounded-lg mt-3 p-2 text-lg"
                  placeholder="Tell us about your location in details"
                />
              </div>
              <button className="btn btn-wide btn-neutral" type="submit">
                Add
              </button>
            </form>
          </div>
        )}
      </>
    </div>
  );
};

export default MyDashboard;

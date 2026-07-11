import React, { useEffect, useState } from "react";
import "../Login/Login.css";
import { useForm } from "react-hook-form";
import { FaGoogle, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { IoCloudUploadOutline, IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { getApiBaseUrl } from "../../utils/apiConfig";
import AnimateText from "@moxy/react-animate-text";
import Swal from "sweetalert2";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";

const Register = () => {
  const { signUp, updateUserProfile, signInGoogle, setIsAuthLoading } =
    useAuthContext();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [fileDragged, setFileDragged] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  let from = location.state?.from?.pathname || "/";
  from = from?.includes("dashboard") ? "/" : from;

  // react hook form settings
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleFileDragOver = (e) => {
    e.preventDefault();
    setFileDragged(true);
  };
  const handleFileDragEnter = (e) => {
    e.preventDefault();
    setFileDragged(true);
  };
  const handleFileDragLeave = (e) => {
    e.preventDefault();
    setFileDragged(false);
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    setFileDragged(false);
    setProfilePicFile(event.dataTransfer.files);

    // setting input(file type) as well to remove required error
    document.getElementById("profilePicture").files = event.dataTransfer.files;
  };

  /**
   **** Profile Pic file upload logic: (two ways) ****
   * 1) profilePicFile is set when user click browse image button because in input(file) tag's onChange event setProfilePicFile is called.
   *
   * 2) Again, profilePicFile is set when user dragOver the pic and the dragOver function is called
   *
   * 3) So, in both ways file is set to profilePicFile and when close btn is clicked
   * profilePicFile is set to null and also input(file) tag value is reset to null using
   * input.value=""
   */
  const [profilePicFile, setProfilePicFile] = useState(null);

  // check profile pic size limit 200KB
  useEffect(() => {
    if (profilePicFile)
      if (profilePicFile[0]?.size > 200 * 1024) {
        setProfilePicFile(null);
        document.getElementById("profilePicture").value = "";

        Swal.fire({
          title: "Limit Exceeded!",
          icon: "error",
          text: "Image size must not exceed 200KB",
          confirmButtonColor: "#eebfab",
          confirmButtonText: "Ok, I'll change",
          showCloseButton: true,
        });
      }
  }, [profilePicFile]);

  // convert file/image to base64
  const convertBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;
    });
  };

  // form output
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);

  const onSubmit = (data) => {
    setRegisterLoading(true);
    setRegisterError(false);

    // convert image to base64
    convertBase64(profilePicFile[0]).then((base64Image) => {
      const apiBaseUrl = getApiBaseUrl();
      // upload image to cloudinary
      axios
        .post(`${apiBaseUrl}/cloudinary-upload`, {
          name: data?.name,
          img: base64Image,
        })
        .then((res) => {
          if (!res.data?.success) {
            Swal.fire({
              title: "Failed",
              text: "Something went wrong while uploading profile picture. Try again later",
              icon: "error",
            });

            return;
          }

          data["profilePic"] = res.data.imgURL;

          // sign up user with email, password
          signUp(data.email, data.password)
            .then((result) => {
              // update user's profile
              if (result.user?.uid) {
                updateUserProfile(data?.name, data?.profilePic)
                  .then(() => {
                    // add user to users collection in db
                    axios.post(
                      `${apiBaseUrl}/users`,
                      {
                        name: result?.user?.displayName,
                        email: result?.user?.email,
                        img: result?.user?.photoURL,
                      }
                    );
                    toast.success(`Authenticated as ${result?.user?.email}`);
                    reset(); // reset the form
                    setProfilePicFile(null); // reset profile pic state
                    setRegisterLoading(false);
                    navigate(from, { replace: true });
                  })
                  .catch((error) => {
                    setRegisterError(error?.code);
                    setRegisterLoading(false);
                    setIsAuthLoading(false);
                  });
              }
            })
            .catch((error) => {
              setRegisterError(error?.code);
              setRegisterLoading(false);
              document.documentElement.scroll({
                top: 0,
                left: 0,
                behavior: "smooth",
              });
              setIsAuthLoading(false);
            });
        });
    });
  };

  // google sign in
  const handleGoogleSignIn = () => {
    setRegisterError(false);
    signInGoogle()
      .then((res) => {
        const apiBaseUrl = getApiBaseUrl();
        // add user to users collection in db
        axios.post(`${apiBaseUrl}/users`, {
          name: res?.user?.displayName,
          email: res?.user?.email,
          img: res?.user?.photoURL,
        });

        toast.success(`Authenticated as ${res?.user?.email}`);
        navigate(from, { replace: true });
      })
      .catch((error) => {
        setRegisterError(error?.code);
        document.documentElement.scroll({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
        setIsAuthLoading(false);
      });
  };

  return (
    <div
      className="container mt-20 mb-24 px-6 md:px-0"
      style={{ fontFamily: "var(--poppins)" }}
    >
      <CustomHelmet title="Register" />
      <h1
        className="text-6xl font-bold tracking-wide mb-10"
        style={{ fontFamily: "var(--italiana)" }}
      >
        <AnimateText initialDelay={0.2} wordDelay={0.2} separator="">
          <span>Register</span>
        </AnimateText>
      </h1>

      {/* error notification */}
      {registerError && (
        <div
          role="alert"
          className="alert alert-error mb-8 rounded-lg text-white "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            onClick={() => setRegisterError(null)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error: {registerError.replace("auth/", "")}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="loginRegisterForm">
        <div className="w-full auth-input-con">
          <p className="text-gray-600">Full Name *</p>
          <input
            type="text"
            {...register("name", { required: true })}
            className="text-xl border-0 outline-none border-b-2 border-gray-400 w-full mt-3 pb-2"
          />
          {errors.name && (
            <span className="text-red-500 mt-1 block">
              Your full name is required
            </span>
          )}
        </div>

        {/* email input */}
        <div className="w-full mt-8 auth-input-con">
          <p className="text-gray-600">Email address *</p>
          <input
            type="email"
            {...register("email", { required: true })}
            className="text-xl border-0 outline-none border-b-2 border-gray-400 w-full mt-3 pb-2"
          />
          {errors.email && (
            <span className="text-red-500 mt-1 block">Email is required</span>
          )}
        </div>

        {/* password input */}
        <div className="w-full mt-8 relative auth-input-con">
          <p className="text-gray-600">Password *</p>
          <input
            type={showPass ? "text" : "password"}
            {...register("password", {
              required: true,
              pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            })}
            className="text-xl border-0 outline-none border-b-2 border-gray-400 w-full mt-3 pb-2"
          />
          {errors.confirmPassword?.message === "unmatched password" && (
            <span className="text-red-500 mt-1 block">
              Your Password do not match
            </span>
          )}

          {errors.password?.type === "required" && (
            <span className="text-red-500 mt-1 block">
              Password is required
            </span>
          )}

          {!errors.confirmPassword && errors.password?.type === "pattern" && (
            <span className="text-red-500 mt-1 block">
              Password must have one uppercase, one lowercase, one number, one
              special character and 8 characters long!
            </span>
          )}
          <div className="absolute top-10 right-1">
            {showPass ? (
              <FaRegEyeSlash
                className="text-2xl"
                onClick={() => setShowPass(!showPass)}
              />
            ) : (
              <FaRegEye
                className="text-2xl"
                onClick={() => setShowPass(!showPass)}
              />
            )}
          </div>
        </div>

        {/* confirm password input */}
        <div className="w-full mt-8 relative auth-input-con">
          <p className="text-gray-600">Confirm Password *</p>
          <input
            type={showConfirmPass ? "text" : "password"}
            {...register("confirmPassword", {
              required: true,
              validate: (val) => {
                if (watch("password") != val) {
                  return "unmatched password";
                }
              },
            })}
            className="text-xl border-0 outline-none border-b-2 border-gray-400 w-full mt-3 pb-2"
          />

          {errors.confirmPassword?.type === "required" && (
            <span className="text-red-500 mt-1 block">
              Confirm Password is required
            </span>
          )}

          {errors.confirmPassword?.message === "unmatched password" && (
            <span className="text-red-500 mt-1 block">
              Your passwords do not match
            </span>
          )}
          <div className="absolute top-10 right-1">
            {showConfirmPass ? (
              <FaRegEyeSlash
                className="text-2xl"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              />
            ) : (
              <FaRegEye
                className="text-2xl"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              />
            )}
          </div>
        </div>

        {/* profile pic input */}
        <div className="w-full mt-8">
          <p className="text-gray-600 mb-5">Profile Picture *</p>
          <input
            type="file"
            {...register("profilePic", {
              required: true,
              onChange: (e) => setProfilePicFile(e.target.files),
            })}
            id="profilePicture"
            accept="image/*"
            hidden
          />

          {errors.profilePic?.type === "required" &&
            document.getElementById("profilePicture").value == "" && (
              <span className="text-red-500 mt-1 block">
                Your Profile Picture is required
              </span>
            )}

          {!profilePicFile ? (
            <button
              className={`border border-gray-400 border-dashed h-[170px] w-full md:w-[50%] flex justify-center items-center ${
                fileDragged ? "shadow-xl" : ""
              }`}
              onDrop={handleFileDrop}
              onDragEnter={handleFileDragEnter}
              onDragLeave={handleFileDragLeave}
              onDragOver={handleFileDragOver}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("profilePicture").click();
              }}
            >
              <div className="text-center space-y-4">
                <IoCloudUploadOutline className="text-6xl text-[var(--pink-gold)] block mx-auto" />
                <p className="text-lg">
                  Drag & Drop <br /> or{" "}
                  <span className="text-primary">browse image</span>
                </p>
              </div>
            </button>
          ) : (
            <div className="border-2 border-gray-400 rounded-xl p-4 w-fit flex justify-between items-center gap-16">
              <div className={profilePicFile && "flex items-center gap-4"}>
                {profilePicFile && (
                  <img
                    src={URL.createObjectURL(profilePicFile[0])}
                    alt={profilePicFile[0]?.name}
                    className="w-[55px] h-[55px] rounded-full"
                  />
                )}
                <span>{profilePicFile[0]?.name}</span>
              </div>
              <button
                onClick={() => {
                  document.getElementById("profilePicture").value = "";
                  setProfilePicFile(null);
                }}
              >
                <IoClose className="text-xl" />
              </button>
            </div>
          )}
        </div>

        {/* register button */}
        <div className="mt-16 flex items-center gap-3">
          <button
            type="submit"
            className="uppercase text-sm text-white bg-black w-32 h-11 hover:rounded-xl transition-all duration-300"
            disabled={registerLoading}
          >
            {registerLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Sign Up"
            )}
          </button>
          <p>
            Already have an account?{" "}
            <Link to={"/login"} className="underline block md:inline">
              Sign In
            </Link>
          </p>
        </div>
      </form>

      <div className="flex justify-start items-center mt-7">
        <p className="w-[40%] md:w-[15%] font-medium">Or, continue with</p>
        <div className="w-[60%] md:w-full bg-gray-400 h-[1px]"></div>
      </div>

      <div className="flex items-center gap-6 mt-5">
        <div
          className="text-lg text-[var(--pink-gold)] bg-black p-4 rounded-full cursor-pointer hover:text-black hover:bg-[--pink-gold] transition-all duration-300"
          onClick={handleGoogleSignIn}
        >
          <FaGoogle />
        </div>
      </div>
    </div>
  );
};

export default Register;

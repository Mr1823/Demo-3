import React from "react";
import { Link, useRouteError } from "react-router-dom";
import img404 from "../../assets/page404.png";

const ErrorPage = () => {
  const error = useRouteError();
  return (
    <div
      className="h-screen w-full flex justify-center items-center"
      style={{ fontFamily: "var(--poppins)" }}
    >
      <div className="md:w-1/2 text-center px-4 md:px-0">
        <h1 className="text-error font-bold text-5xl md:text-6xl">
          {error?.status} ERROR
        </h1>
        <p className="text-red-700 font-semibold mt-2">
          {error?.error?.message}
        </p>
        <img src={img404} alt="" className="md:w-[77%] mx-auto block my-10" />
        <Link to="/">
          <button className="btn btn-wide text-white rounded-none mt-8 btn-outline btn-error">
            BACK TO HOME
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;

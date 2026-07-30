import React from "react";
import PhoneAuthForm from "../../components/PhoneAuthForm/PhoneAuthForm";

const Register = () => (
  <PhoneAuthForm
    helmetTitle="Sign Up"
    heroEyebrow="Timeless Craftsmanship"
    heroHeadline="Since generations, we have been crafting stories in gold and precious stones. Join our circle of Heritage."
    step1Eyebrow="Join Us"
    step1Title="Join the Heritage"
    step1Subtitle="Create an account to start your journey with us"
    bottomText="Already have an account?"
    bottomLinkTo="/login"
    bottomLinkLabel="Sign In"
  />
);

export default Register;

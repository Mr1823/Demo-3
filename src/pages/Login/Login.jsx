import React from "react";
import PhoneAuthForm from "../../components/PhoneAuthForm/PhoneAuthForm";

const Login = () => (
  <PhoneAuthForm
    helmetTitle="Sign In"
    heroEyebrow="Heritage Craftsmanship"
    heroHeadline="Timeless Elegance, Handcrafted for You."
    step1Eyebrow="Welcome"
    step1Title="Welcome Back"
    step1Subtitle="Sign in to access your wishlist and orders"
    bottomText="Don't have an account?"
    bottomLinkTo="/register"
    bottomLinkLabel="Sign Up"
  />
);

export default Login;

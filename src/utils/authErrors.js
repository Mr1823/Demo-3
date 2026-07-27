export const getFriendlyAuthErrorMessage = (errorCode) => {
  if (!errorCode) return "An unknown error occurred. Please try again.";

  // Strip "auth/" if present
  const code = errorCode.replace("auth/", "");

  switch (code) {
    case "user-not-found":
      return "We couldn't find an account with that email address.";
    case "wrong-password":
      return "The password you entered is incorrect.";
    case "invalid-email":
      return "Please enter a valid email address.";
    case "user-disabled":
      return "This account has been disabled. Please contact support.";
    case "email-already-in-use":
      return "An account already exists with this email address.";
    case "weak-password":
      return "Your password is too weak. Please choose a stronger password.";
    case "operation-not-allowed":
      return "This sign-in method is currently disabled.";
    case "too-many-requests":
      return "Too many unsuccessful attempts. Please try again later or reset your password.";
    case "network-request-failed":
      return "Network error. Please check your internet connection and try again.";
    case "invalid-credential":
      return "The credentials you entered are invalid.";
    case "invalid-login-credentials":
      return "Invalid email or password. Please try again.";
    default:
      return `Authentication error: ${code.replace(/-/g, " ")}`;
  }
};

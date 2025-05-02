import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaPhone,
  FaGoogle,
  FaFacebook,
  FaGithub,
  FaCheck,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider, // Import Facebook provider
  GithubAuthProvider, // Import Twitter provider
  signInWithPopup,
} from "firebase/auth";
interface SignUpPageProps {
  onLoginClick: () => void;
}
import { app } from "./firebase";
const SignUpPage: React.FC<SignUpPageProps> = ({ onLoginClick }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong" | ""
  >("");
  // --- Social Sign-In Handlers ---
  const auth = getAuth(app);
  // Generic function to handle social sign-in popup
  const handleSocialSignIn = async (provider: any) => {
    // Use 'any' for provider type flexibility or define a more specific type
    // Set custom parameters for the popup, prompting account selection
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      // Initiate the sign-in process with the specified provider
      const firebaseResponse = await signInWithPopup(auth, provider);

      // Extract user details from the response
      const userDetails = {
        fullName: firebaseResponse.user.displayName,
        email: firebaseResponse.user.email,
        profilePhotoUrl: firebaseResponse.user.photoURL,
        // Add other details as needed, e.g., provider ID
        providerId: firebaseResponse.providerId,
      };

      // Save user details in localStorage
      localStorage.setItem("user", JSON.stringify(userDetails));

      // Set submitted state to trigger success animation (optional)
      setSubmitted(true);

      // Redirect to the homepage after a short delay
      setTimeout(() => {
        window.location.href = "/"; // Or your desired redirect path
      }, 1000);
    } catch (error: any) {
      // Catch and log any errors during authentication
      console.error("Social Sign-In Error:", error);
      // Display a user-friendly error message
      setErrorMessage(
        `Sign-in failed: ${error.message || "Please try again."}`
      );
      // Log detailed error information for debugging
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  // Google Sign-In Handler
  const handleGoogleClick = () => {
    const provider = new GoogleAuthProvider();
    handleSocialSignIn(provider);
  };

  // Facebook Sign-In Handler
  const handleFacebookClick = () => {
    const provider = new FacebookAuthProvider();
    // Add required scopes if needed, e.g., 'email', 'public_profile'
    // provider.addScope('email');
    handleSocialSignIn(provider);
  };

  // Twitter Sign-In Handler
  const handleGithubClick = () => {
    const provider = new GithubAuthProvider();
    // Add required scopes if needed, e.g., 'user:email'
    // provider.addScope('user:email');
    handleSocialSignIn(provider);
  };
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    // Check password strength
    const { password } = formData;
    if (password.length === 0) {
      setPasswordStrength("");
    } else if (password.length < 8) {
      setPasswordStrength("weak");
    } else if (
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      setPasswordStrength("strong");
    } else {
      setPasswordStrength("medium");
    }
  }, [formData.password]);

  const validateForm = () => {
    const { fullName, email, mobile, password, confirmPassword } = formData;

    if (!fullName || fullName.length < 3) {
      setErrorMessage("Full name must be at least 3 characters long");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }

    const mobileRegex = /^(\+91)\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      setErrorMessage("Mobile number must be in format: +91XXXXXXXXXX");
      return false;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
      // Store user data in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          mobile: formData.mobile,
        })
      );
      // Redirect to main page after 1 second
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "mobile") {
      if (!value.startsWith("+91")) {
        processedValue = "+91" + value.replace("+91", "");
      }
      if (processedValue.length > 13) {
        processedValue = processedValue.slice(0, 13);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white p-10 rounded-2xl shadow-2xl w-96 text-center z-10"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-extrabold text-gray-800 mb-2"
        >
          THE KARIGAR STOP
        </motion.h1>
        <h2 className="text-xl font-semibold text-gray-600 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <FaUser className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <FaPhone className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number (+91)"
              value={formData.mobile}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative"
          >
            <FaLock className="absolute left-3 top-3 text-gray-500" />
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
            {passwordStrength && (
              <div className="mt-1 text-sm">
                Password strength:
                <span
                  className={`ml-1 font-semibold ${
                    passwordStrength === "weak"
                      ? "text-red-500"
                      : passwordStrength === "medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {passwordStrength}
                </span>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative"
          >
            <FaLock className="absolute left-3 top-3 text-gray-500" />
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md ${
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword
                  ? "border-red-500"
                  : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
            {formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <div className="mt-1 text-sm text-red-500">
                  Passwords do not match
                </div>
              )}
          </motion.div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition duration-300"
          >
            Sign Up
          </motion.button>
        </form>

        <p className="text-gray-600 mt-4">Or sign up with</p>
        <div className="flex justify-center gap-4 mt-3">
          <motion.button
            onClick={handleGoogleClick}
            whileHover={{ scale: 1.1 }}
            className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600"
          >
            <FaGoogle />
          </motion.button>
          <motion.button
            onClick={handleFacebookClick}
            whileHover={{ scale: 1.1 }}
            className="bg-blue-700 text-white p-3 rounded-full shadow-lg hover:bg-blue-800"
          >
            <FaFacebook />
          </motion.button>
          <motion.button
            onClick={handleGithubClick}
            whileHover={{ scale: 1.1 }}
            className="bg-blue-400 text-white p-3 rounded-full shadow-lg hover:bg-blue-500"
          >
            <FaGithub />
          </motion.button>
        </div>

        <p className="text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            onClick={onLoginClick}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </motion.div>

      {/* Success Animation */}
      {submitted && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute bg-green-500 text-white p-4 rounded-full"
        >
          <FaCheck size={32} />
        </motion.div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignUpPage;

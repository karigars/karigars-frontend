import React, { useState, useEffect } from "react";
import { 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaGoogle, 
  FaFacebook, 
  FaTwitter, 
  FaCar 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ForgotPasswordPage from './ForgotPasswordPage';

interface LoginPageProps {
  onSignUpClick: () => void;
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSignUpClick, onLoginSuccess }) => {
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loginMethod, setLoginMethod] = useState("password");
  const [otpSent, setOtpSent] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    if (validationMessage) {
      const timer = setTimeout(() => setValidationMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [validationMessage]);

  const validateLoginIdentifier = (identifier: string) => {
    if (loginMethod === "otp") {
      if (!/^(\+91)\d{10}$/.test(identifier)) {
        setValidationMessage("Please enter a valid mobile number (+91XXXXXXXXXX)");
        return false;
      }
    } else {
      if (identifier.startsWith("+91")) {
        if (!/^(\+91)\d{10}$/.test(identifier)) {
          setValidationMessage("Please enter a valid mobile number (+91XXXXXXXXXX)");
          return false;
        }
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(identifier)) {
          setValidationMessage("Please enter a valid email address");
          return false;
        }
      }
    }
    return true;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLoginIdentifier(loginIdentifier)) {
      return;
    }

    if (loginMethod === "password" && !password) {
      setValidationMessage("Please enter your password");
      return;
    }

    setSubmitted(true);
    
    // Create mock user data for demonstration
    const mockUserData = {
      fullName: "Demo User",
      email: loginIdentifier.includes("@") ? loginIdentifier : "demo@example.com",
      mobile: loginIdentifier.startsWith("+91") ? loginIdentifier : "+911234567890"
    };

    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(mockUserData));
    
    // Call the onLoginSuccess callback
    onLoginSuccess();
  };

  const handleSendOtp = () => {
    if (!/^(\+91)\d{10}$/.test(loginIdentifier)) {
      setValidationMessage("Please enter a valid mobile number (+91XXXXXXXXXX)");
      return;
    }
    setOtpSent(true);
  };

  if (showForgotPassword) {
    return <ForgotPasswordPage onBack={() => setShowForgotPassword(false)} />;
  }

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
        <h2 className="text-xl font-semibold text-gray-600 mb-6">Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mb-4"
          >
            <FaUser className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Mobile Number or Email"
              value={loginIdentifier}
              onChange={(e) => {
                let value = e.target.value;
                if (value.startsWith("+91") && value.length > 13) {
                  value = value.slice(0, 13);
                }
                setLoginIdentifier(value);
              }}
              maxLength={loginIdentifier.startsWith("+91") ? 13 : undefined}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            />
          </motion.div>

          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={() => { setLoginMethod("password"); setOtpSent(false); }}
              className={`mx-2 font-semibold ${loginMethod === "password" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod("otp")}
              className={`mx-2 font-semibold ${loginMethod === "otp" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
            >
              OTP Login
            </button>
          </div>

          {loginMethod === "password" ? (
            <>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative mb-2"
              >
                <FaLock className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                />
                <AnimatePresence mode="wait">
                  {passwordFocused ? (
                    <motion.div
                      key="closed"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="absolute right-3 top-3 text-gray-500"
                    >
                      <FaEyeSlash />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="open"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="absolute right-3 top-3 text-gray-500"
                    >
                      <FaEye />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <div className="text-right mb-4">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </>
          ) : (
            <>
              {!otpSent ? (
                <motion.button
                  type="button"
                  onClick={handleSendOtp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition duration-300 mb-4"
                >
                  Send OTP
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="relative mb-2"
                >
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full pl-4 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md"
                  />
                  <div className="text-right mt-2">
                    <a href="#" className="text-green-600 hover:underline" onClick={() => setOtpSent(false)}>
                      Resend OTP
                    </a>
                  </div>
                </motion.div>
              )}
            </>
          )}

          <div className="flex items-center mb-4">
            <motion.input whileHover={{ scale: 1.1 }} type="checkbox" id="remember" className="mr-2" />
            <label htmlFor="remember" className="text-gray-600">Remember Me</label>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition duration-300"
          >
            {loginMethod === "password" ? "Login" : "Verify OTP"}
          </motion.button>

          <p className="text-gray-600 mt-4">Or continue with</p>
          <div className="flex justify-center gap-4 mt-3">
            <motion.button whileHover={{ scale: 1.1 }} className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600">
              <FaGoogle />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} className="bg-blue-700 text-white p-3 rounded-full shadow-lg hover:bg-blue-800">
              <FaFacebook />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} className="bg-blue-400 text-white p-3 rounded-full shadow-lg hover:bg-blue-500">
              <FaTwitter />
            </motion.button>
          </div>
        </form>
        <p className="text-gray-600 mt-4">
          Don't have an account? <button onClick={onSignUpClick} className="text-blue-600 hover:underline">Sign up</button>
        </p>
      </motion.div>

      {submitted && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "110%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute top-1/2 transform -translate-y-1/2"
          onAnimationComplete={() => setSubmitted(false)}
        >
          <FaCar size={48} className="text-gray-800" />
        </motion.div>
      )}

      {/* Centered Validation Message */}
      <AnimatePresence>
        {validationMessage && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            {validationMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
import React from "react";
import { Button } from "../ui/button";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "@/firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "@/redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const GoogleAuth = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const firebaseResponse = await signInWithPopup(auth, provider);

      // Save user details in localStorage
      const userDetails = {
        fullName: firebaseResponse.user.displayName,
        email: firebaseResponse.user.email,
        profilePhotoUrl: firebaseResponse.user.photoURL,
      };

      localStorage.setItem("user", JSON.stringify(userDetails)); // Save the details in localStorage

      // Optionally dispatch the Redux action
      dispatch(signInSuccess(userDetails));

      navigate("/"); // Navigate to the homepage or any other page you want
    } catch (error) {
      console.log(error); // Handle any errors during authentication
      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        console.log("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.log("Error request:", error.request);
      } else {
        console.log("Error message:", error.message);
      }
    }
  };

  return (
    <div>
      <Button
        type="button"
        className="bg-green-500 w-full"
        onClick={handleGoogleClick}
      >
        Continue with Google
      </Button>
    </div>
  );
};

export default GoogleAuth;

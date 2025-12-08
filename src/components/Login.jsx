// src/components/Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import "./Login.css";

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    flow: "implicit",
    onSuccess: (tokenResponse) => {
      console.log("Google OAuth success:", tokenResponse);

      try {
        localStorage.setItem(
          "eztech_google_token",
          JSON.stringify(tokenResponse)
        );
      } catch (err) {
        console.warn("Failed to save Google token:", err);
      }
      // Tell App that login succeeded
      onLoginSuccess();
      // Redirect to main interface
      navigate("/", { replace: true });
    },
    onError: (errorResponse) => {
      console.error("Google OAuth error:", errorResponse);
      alert("Google login failed. Please try again.");
    },
    scope: "openid profile email",
  });

  return (
    <div className="page page-login">
      <div className="login-card">
        <h2 className="login-title">EZTechMovie Login</h2>
        <p className="login-text">
          Please sign in with your Google account to access StreamList, Movies,
          Subscriptions, Cart, and Checkout.
        </p>

        <button className="login-button" onClick={() => login()}>
          Sign in with Google
        </button>

        <p className="login-note">This login uses Google OAuth.</p>
      </div>
    </div>
  );
}

export default Login;

// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";

import "./App.css";
import eztechLogo from "./assets/eztechmovie_navlogo.png";

import StreamList from "./components/StreamList";
import Movies from "./components/Movies";
import Cart from "./components/Cart";
import About from "./components/About";
import Subscriptions from "./components/Subscriptions";
import CreditCard from "./components/CreditCard";
import Login from "./components/Login";

import products from "./data";

const CART_STORAGE_KEY = "eztech_cart_items";
const AUTH_STORAGE_KEY = "eztech_is_authenticated";

function App() {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.warn("Failed to read cart from localStorage:", err);
    }
    return [];
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved === "true") return true;
    } catch (err) {
      console.warn("Failed to read auth from localStorage:", err);
    }
    return false;
  });

  // PWA install button state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.warn("Failed to save cart to localStorage:", err);
    }
  }, [cartItems]);

  // Persist auth flag
  useEffect(() => {
    try {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        isAuthenticated ? "true" : "false"
      );
    } catch (err) {
      console.warn("Failed to save auth flag:", err);
    }
  }, [isAuthenticated]);

  // beforeinstallprompt + appinstalled for PWA
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log("EZTechMovie StreamList installed as PWA");
      setDeferredPrompt(null);
      setIsInstallable(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    try {
      const { outcome } = await deferredPrompt.userChoice;
      console.log("User chose install outcome:", outcome);
    } catch (err) {
      console.warn("Install prompt error:", err);
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // Google OAuth login success handler
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const totalCartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Wrapper to protect routes
  function RequireAuth({ children }) {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="navbar-left">
            <img src={eztechLogo} alt="EZTechMovie logo" className="logo-img" />
            <div className="nav-links">
              <NavLink to="/" end className="nav-link">
                StreamList
              </NavLink>
              <NavLink to="/movies" className="nav-link">
                Movies
              </NavLink>
              <NavLink to="/subscriptions" className="nav-link">
                Subscriptions
              </NavLink>
              <NavLink to="/cart" className="nav-link nav-link-cart">
                Cart
                <span className="cart-count-badge">{totalCartCount}</span>
              </NavLink>
              <NavLink to="/about" className="nav-link">
                About
              </NavLink>
            </div>
          </div>

          <div className="navbar-right">
            {isInstallable && (
              <button
                type="button"
                className="install-app-button"
                onClick={handleInstallClick}
              >
                Install App
              </button>
            )}

            {isAuthenticated && (
              <button
                type="button"
                className="install-app-button"
                onClick={handleLogout}
                style={{ marginLeft: "0.75rem" }}
              >
                Log Out
              </button>
            )}
          </div>
        </nav>

        <main className="content">
          <Routes>
            {/* Public route: login only */}
            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />

            {/* Protected routes: require login */}
            <Route
              path="/"
              element={
                <RequireAuth>
                  <StreamList />
                </RequireAuth>
              }
            />
            <Route
              path="/movies"
              element={
                <RequireAuth>
                  <Movies />
                </RequireAuth>
              }
            />
            <Route
              path="/subscriptions"
              element={
                <RequireAuth>
                  <Subscriptions
                    products={products}
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                  />
                </RequireAuth>
              }
            />
            <Route
              path="/cart"
              element={
                <RequireAuth>
                  <Cart cartItems={cartItems} setCartItems={setCartItems} />
                </RequireAuth>
              }
            />
            <Route
              path="/checkout"
              element={
                <RequireAuth>
                  <CreditCard />
                </RequireAuth>
              }
            />
            <Route
              path="/about"
              element={
                <RequireAuth>
                  <About />
                </RequireAuth>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

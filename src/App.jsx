// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import "./App.css";
import eztechLogo from "./assets/eztechmovie_navlogo.png";

import StreamList from "./components/StreamList";
import Movies from "./Components/Movies";
import Cart from "./components/Cart";
import About from "./components/About";
import Subscriptions from "./components/Subscriptions";

import products from "./data";

const CART_STORAGE_KEY = "eztech_cart_items";

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

  // 🔹 PWA install prompt state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // persist cart in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.warn("Failed to save cart to localStorage:", err);
    }
  }, [cartItems]);

  // 🔹 Listen for beforeinstallprompt + appinstalled
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the default mini-infobar
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

  // 🔹 When user clicks the Install App button
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    try {
      const { outcome } = await deferredPrompt.userChoice;
      console.log("User chose install outcome:", outcome);
    } catch (err) {
      console.warn("Install prompt error:", err);
    }

    // Once prompted, we can't reuse this event
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const totalCartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

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

          {/* 🔹 Right side: Install App button (only when installable) */}
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
          </div>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={<StreamList />} />
            <Route path="/movies" element={<Movies />} />
            <Route
              path="/subscriptions"
              element={
                <Subscriptions
                  products={products}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
              }
            />
            <Route
              path="/cart"
              element={
                <Cart cartItems={cartItems} setCartItems={setCartItems} />
              }
            />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

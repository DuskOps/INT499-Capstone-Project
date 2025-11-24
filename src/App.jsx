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

import StreamList from "./Components/StreamList";
import Movies from "./Components/Movies";
import Cart from "./components/Cart";
import About from "./Components/About";
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

  // persist cart in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.warn("Failed to save cart to localStorage:", err);
    }
  }, [cartItems]);

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

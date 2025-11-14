import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import StreamList from "./components/StreamList";
import Movies from "./components/Movies";
import Cart from "./components/Cart";
import About from "./components/About";

import eztechLogo from "./assets/eztechmovie_navlogo.png";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="navbar-left">
            <img src={eztechLogo} alt="EZTech Logo" className="logo-img" />

            <div className="nav-links">
              <NavLink to="/" end className="nav-link">
                StreamList
              </NavLink>
              <NavLink to="/movies" className="nav-link">
                Movies
              </NavLink>
              <NavLink to="/cart" className="nav-link">
                Cart
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
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

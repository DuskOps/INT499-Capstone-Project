import React from "react";
import "./About.css";

function About() {
  return (
    <div className="page page-about">
      <div className="about-container">
        <h2 className="about-title">About EZTechMovie</h2>

        <p className="about-text">
          EZTechMovie is a modern streaming companion application designed to
          help users keep track of shows, explore movies, and customize their
          entertainment experience.
        </p>

        <p className="about-text">
          This application was built as part of a computer information
          technology capstone focused on mastering React components, routing,
          API integration, UI design, and persistent data using browser storage.
        </p>

        <h3 className="about-subtitle">What This App Includes</h3>

        <ul className="about-list">
          <li>A StreamList to track your favorite shows and movies</li>
          <li>Integration with the TMDB API for movie searches</li>
          <li>Shopping cart functionality (subscriptions & accessories)</li>
          <li>LocalStorage persistence across the entire application</li>
          <li>A navigation system for smooth routing</li>
        </ul>

        <h3 className="about-subtitle">Our Mission</h3>

        <p className="about-text">
          Our goal is to build a user-friendly, stylish platform that makes
          entertainment easier to manage. Whether you're building your watch
          list, browsing for new films, EZTechMovie offers an intuitive
          experience.
        </p>
      </div>
    </div>
  );
}

export default About;

import React, { useEffect } from "react";
import "./About.css";

function About() {
  useEffect(() => {
    document.title = "About - EZTechMovie";
  }, []);

  return (
    <div className="page page-about">
      <h2 className="page-title">About</h2>
      <p className="page-subtitle">This page will be developed in Week 5.</p>
    </div>
  );
}

export default About;

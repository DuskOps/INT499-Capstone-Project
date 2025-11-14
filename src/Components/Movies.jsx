import React, { useEffect } from "react";
import "./Movies.css";

function Movies() {
  useEffect(() => {
    document.title = "Movies - EZTechMovie";
  }, []);

  return (
    <div className="page page-movies">
      <h2 className="page-title">Movies</h2>
      <p className="page-subtitle">This page will be developed in Week 4.</p>
    </div>
  );
}

export default Movies;

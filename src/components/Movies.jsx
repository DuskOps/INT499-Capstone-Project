// src/Components/Movies.jsx
import React, { useState, useEffect } from "react";
import "./Movies.css";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/movie";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w342";

// localStorage keys
const STORAGE_KEY_QUERY = "eztechmovie_tmdb_query";
const STORAGE_KEY_RESULTS = "eztechmovie_tmdb_results";

function Movies() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load last search from localStorage when page mounts
  useEffect(() => {
    try {
      const savedQuery = localStorage.getItem(STORAGE_KEY_QUERY);
      const savedResults = localStorage.getItem(STORAGE_KEY_RESULTS);

      if (savedQuery) setQuery(savedQuery);
      if (savedResults) {
        const parsed = JSON.parse(savedResults);
        if (Array.isArray(parsed)) {
          setResults(parsed);
        }
      }
    } catch (err) {
      console.warn("Failed to read TMDB data from localStorage:", err);
    }
  }, []);

  // Main search submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (!TMDB_API_KEY) {
      setError("TMDB API key is missing. Check your .env (VITE_TMDB_API_KEY).");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    setShowSuggestions(false);

    try {
      const url = `${TMDB_SEARCH_URL}?api_key=${TMDB_API_KEY}&language=en-US&include_adult=false&query=${encodeURIComponent(
        trimmed
      )}`;

      const res = await fetch(url);

      if (!res.ok) {
        const text = await res.text();
        console.error("TMDB error response:", res.status, text);
        throw new Error("TMDB returned an error. See console for details.");
      }

      const data = await res.json();
      const movies = data.results || [];

      setResults(movies);

      // Save to localStorage so refresh keeps data
      try {
        localStorage.setItem(STORAGE_KEY_QUERY, trimmed);
        localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(movies));
      } catch (storageErr) {
        console.warn("Failed to save TMDB data to localStorage:", storageErr);
      }
    } catch (err) {
      console.error("Error fetching TMDB movies:", err);
      setError(
        err.message ||
          "Something went wrong while fetching movies. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Autocomplete: fetch suggestions when user types
  useEffect(() => {
    const trimmed = query.trim();

    if (!TMDB_API_KEY || trimmed.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      try {
        const url = `${TMDB_SEARCH_URL}?api_key=${TMDB_API_KEY}&language=en-US&include_adult=false&page=1&query=${encodeURIComponent(
          trimmed
        )}`;

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) return;

        const data = await res.json();
        const movies = (data.results || []).slice(0, 5); // top 5 suggestions

        if (!cancelled) {
          setSuggestions(movies);
          setShowSuggestions(movies.length > 0);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("Autocomplete fetch failed:", err);
        }
      }
    }, 400); // debounce: wait 400ms after typing stops

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  const handleSuggestionClick = (title) => {
    setQuery(title);
    setShowSuggestions(false);
    // trigger a full search immediately
    // simulate submit without needing the event
    void (async () => {
      await handleSubmit({ preventDefault: () => {} });
    })();
  };

  return (
    <div className="page page-movies">
      {/* Page title like in your wireframe */}
      <h2 className="page-title movies-title">Movies</h2>

      {/* Centered description + search panel */}
      <section className="movies-panel">
        <div className="movies-description-box">
          <p>Search the EZTechMovie catalog, enter a title.</p>
        </div>

        {/* Search field (big centered bar with autocomplete) */}
        <form className="movies-search-form" onSubmit={handleSubmit}>
          <div className="movies-search-row">
            <div
              className="movies-autocomplete"
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
            >
              <input
                type="text"
                className="movies-search-input"
                placeholder="Search for a movie title"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => {
                  // small delay so clicks on suggestions still register
                  setTimeout(() => setShowSuggestions(false), 150);
                }}
              />

              {showSuggestions && suggestions.length > 0 && (
                <ul className="movies-suggestions">
                  {suggestions.map((movie) => {
                    const year = movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : "";
                    return (
                      <li
                        key={movie.id}
                        className="movies-suggestion-item"
                        onMouseDown={() =>
                          handleSuggestionClick(
                            year ? `${movie.title} (${year})` : movie.title
                          )
                        }
                      >
                        <span className="movies-suggestion-title">
                          {movie.title}
                        </span>
                        {year && (
                          <span className="movies-suggestion-year">{year}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <button type="submit" className="movies-search-button">
              Search
            </button>
          </div>
        </form>
      </section>

      {/* Status / loading messages under search */}
      {loading && (
        <div className="movies-loading">
          <div className="movies-spinner" />
          <p>Loading movies…</p>
        </div>
      )}

      {error && !loading && (
        <p className="movies-status-text movies-error-text">{error}</p>
      )}

      {!loading && !error && results.length === 0 && query.trim() === "" && (
        <p className="movies-status-text">
          Start by typing a movie title above and press Search.
        </p>
      )}

      {!loading && !error && results.length === 0 && query.trim() !== "" && (
        <p className="movies-status-text">No movies found for that title.</p>
      )}

      {/* Movie posters row(s) under the search bar */}
      <div className="movies-grid">
        {results.map((movie) => {
          const posterUrl = movie.poster_path
            ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
            : null;

          const year = movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : "—";

          return (
            <div key={movie.id} className="movie-card">
              <div className="movie-poster-wrapper">
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="movie-poster"
                  />
                ) : (
                  <div className="movie-poster placeholder">
                    <span>No Poster</span>
                  </div>
                )}
              </div>

              <div className="movie-info">
                <div className="movie-title">{movie.title}</div>
                <div className="movie-meta">
                  <span className="movie-year">{year}</span>
                  {typeof movie.vote_average === "number" && (
                    <span className="movie-rating">
                      ★ {movie.vote_average.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Movies;

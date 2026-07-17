import { useEffect, useState } from "react";
import Search from "./components/Search";
import type { Movie, TrendingMovie } from "./types/movie";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appWrite";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY?.trim();
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([]);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query: string) => {
    if (!API_KEY) {
      setError(
        "TMDB API key is missing. Please add VITE_TMDB_API_KEY to your .env file.",
      );
      return;
    }

    setLoading(true);
    setError("");
    try {
      // API ENDPOINT
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&api_key=${API_KEY}&language=en-US&page=1`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&language=en-US&page=1`;
      // FETCH THE ENDPOINT
      const response = await fetch(endpoint, API_OPTIONS);
      // CHECK RESPONSE IS OK OR NOT
      if (!response.ok) {
        throw new Error(`Failed to fetch movies (${response.status})`);
      }

      // GET THE DATA FROM RESPONSE
      const data = await response.json();
      // CHECK DATA'S RESPONSE IS OK OR NOT
      if (data.Response === "False") {
        setError(data.Error || "Failed to fetch movies.");
        setMovieList([]);
        return;
      }

      // SET ALL MOVIES IN STATE
      setMovieList(data.results || []);

      // SEARCH INCLUDES AND DATA ROWS > 0 -> UPDATE SEARCH COUNT IN DB
      if (query && data.results.length > 0) {
        await updateSearchCount(searchTerm, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setError("Error fetching movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMovies(debouncedSearchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTrendingMovies();
  }, []);
  return (
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="all-movies">
          <h2>All Movies</h2>

          {loading ? (
            <Spinner />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;

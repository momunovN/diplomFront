import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MovieCard from '../components/MovieCard';

const TMDB_API_KEY = "09d13e03c0c446ac654cd31df8281f63";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function Search() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const searchMovies = async () => {
      setLoading(true);
      setNoResults(false);

      try {
        const res = await fetch(
          `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=ru-RU`
        );
        const data = await res.json();

        const formatted = data.results.map(movie => ({
          ...movie,
          posterUrlPreview: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
          nameRu: movie.title,
          ratingKinopoisk: movie.vote_average,
          year: movie.release_date?.split('-')[0] || '—',
          id: movie.id,
        }));

        setResults(formatted);
        setNoResults(formatted.length === 0);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    searchMovies();
  }, [query]);

  return (
    <div className="container-centered py-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">
        Поиск: <span className="text-primary">"{query}"</span>
      </h1>

      {loading && (
        <div className="text-center py-20 text-2xl">Ищем фильмы...</div>
      )}

      {noResults && (
        <div className="text-center py-20">
          <p className="text-3xl text-text-secondary mb-8">Ничего не найдено 😔</p>
          <p className="text-xl text-text-secondary">Попробуйте другой запрос</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
          {results.map(movie => (
            <MovieCard key={movie.id} movie={movie} size="medium" />
          ))}
        </div>
      )}
    </div>
  );
}
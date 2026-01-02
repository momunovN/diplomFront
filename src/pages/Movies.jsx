import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { Button } from '@gravity-ui/uikit';


const TMDB_API_KEY = "09d13e03c0c446ac654cd31df8281f63"; // ← Замени на свой ключ
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  const fetchMovies = async (pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=ru-RU&page=${pageNum}`
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

      setMovies(prev => {
        const unique = formatted.filter(newMovie => !prev.some(m => m.id === newMovie.id));
        return [...prev, ...unique];
      });
      setHasMore(pageNum < data.total_pages);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const loadMore = () => {
    if (!loading && hasMore) setPage(prev => prev + 1);
  };

  return (
  <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
    <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">Все фильмы</h1>

    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} size="medium" />
      ))}
    </div>

    {hasMore && (
      <div className="text-center mt-16">
        <Button size="xl" view="outlined-action" onClick={loadMore} disabled={loading} selected>
          {loading ? 'Загрузка...' : 'Показать ещё'}
        </Button>
      </div>
    )}
  </div>
);
}
import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MovieCard from "../components/MovieCard";

const TMDB_API_KEY = "09d13e03c0c446ac654cd31df8281f63"; // ← Вставь свой ключ сюда
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function Home() {
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [popRes, topRes] = await Promise.all([
          fetch(
            `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=ru-RU&page=1`
          ),
          fetch(
            `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=ru-RU&page=1`
          ),
        ]);

        const popData = await popRes.json();
        const topData = await topRes.json();

        // Добавляем полный URL постера
        const formattedPopular = popData.results.map((movie) => ({
          ...movie,
          posterUrlPreview: movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : null,
          nameRu: movie.title,
          ratingKinopoisk: movie.vote_average,
          year: movie.release_date?.split("-")[0] || "—",
          genres: movie.genre_ids ? [] : [], // жанры можно добавить отдельным запросом, если нужно
        }));

        const formattedTop = topData.results.map((movie) => ({
          ...movie,
          posterUrlPreview: movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : null,
          nameRu: movie.title,
          ratingKinopoisk: movie.vote_average,
          year: movie.release_date?.split("-")[0] || "—",
        }));

        setPopular(formattedPopular);
        setTopRated(formattedTop);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    arrows: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading)
    return (
      <div className="container py-20 text-center text-3xl">
        Загрузка лучших фильмов...
      </div>
    );

  return (
    <div className="container-centered py-12">
      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Популярное сейчас
        </h2>
        <Slider {...settings}>
          {popular.slice(0, 20).map((movie) => (
            <div key={movie.id} className="px-2">
              <MovieCard movie={movie} size="small" />
            </div>
          ))}
        </Slider>
      </section>

      <section>
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Топ рейтинга
        </h2>
        <Slider {...settings}>
          {topRated.slice(0, 20).map((movie) => (
            <div key={movie.id} className="px-2">
              <MovieCard movie={movie} size="small" />
            </div>
          ))}
        </Slider>
      </section>
    </div>
  );
}

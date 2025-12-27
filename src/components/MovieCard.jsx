import { Link } from "react-router-dom";

export default function MovieCard({ movie, size = "medium" }) {
  const poster =
    movie.posterUrlPreview || movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/300x450?text=No+Poster";
  const title = movie.title || movie.nameRu || movie.nameEn || "Без названия";
  const year = movie.release_date?.split("-")[0] || movie.year || "—";
  const rating = movie.vote_average || movie.ratingKinopoisk || null;

  return (
    <Link to={`/movie/${movie.id}`} className="block group">
      <div className="relative overflow-hidden rounded-xl shadow-card transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
        <img
          src={poster}
          alt={title}
          className={`w-full object-cover ${
            size === "small" ? "h-64 md:h-80" : "h-96 md:h-[480px]"
          }`}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {rating && rating > 0 && (
          <div className="absolute top-4 left-4 bg-primary text-black text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
            {typeof rating === "number" ? rating.toFixed(1) : rating}
          </div>
        )}

        {year >= 2025 && (
          <div className="absolute top-4 right-4 bg-secondary text-black text-xs font-bold px-3 py-1 rounded-full">
            NEW
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
          <h3 className="font-bold text-lg truncate">{title}</h3>
          <p className="text-text-secondary text-sm mt-1">
            {year} •{" "}
            {movie.genres
              ?.slice(0, 2)
              .map((g) => g.name || g.genre)
              .join(", ") || "Жанр"}
          </p>
        </div>
      </div>
    </Link>
  );
}

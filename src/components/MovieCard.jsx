import { Link } from "react-router-dom";
import {
  Card,
  Icon,
  Text,
  Label, // ← вот он, правильный компонент
  Flex,
  useTheme,
} from "@gravity-ui/uikit";
import { Star, Calendar, CirclePlayFill } from "@gravity-ui/icons";

export default function MovieCard({ movie, size = "medium" }) {
  const theme = useTheme(); // для доступа к цветам темы (dark)

  const poster =
    movie.posterUrlPreview ||
    (movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/300x450?text=No+Poster");

  const title = movie.title || movie.nameRu || movie.nameEn || "Без названия";
  const year = movie.release_date?.split("-")[0] || movie.year || "—";
  const rating = movie.vote_average || movie.ratingKinopoisk || null;

  const isSmall = size === "small";
  const isNew = parseInt(year, 10) >= 2026;

  return (
    <Link to={`/movie/${movie.id}`} className="block w-full">
      <Card
        view="raised"
        theme="warning" // жёлтый акцент при ховере (как твой #ffcc00)
        className="group overflow-hidden"
        style={{
          borderRadius: "16px",
          transition: "all 0.3s ease",
          transform: "translateY(0)",
        }}
      >
        <div className="relative aspect-[2/3] flex flex-col">
          {/* Постер */}
          <img
            src={poster}
            alt={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Градиентная подложка снизу */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />

          {/* Рейтинг */}
          {rating && rating > 0 && (
            <div className="absolute top-4 left-4">
              <Label
                theme="warning" // жёлтый фон
                size="m" // или "s" для меньшего
                style={{
                  backgroundColor: "#ffcc00", // если нужно переопределить
                  color: "#000",
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                }}
              >
                <Flex gap={1} align="center">
                  <Icon data={Star} size={14} />
                  {typeof rating === "number" ? rating.toFixed(1) : rating}
                </Flex>
              </Label>
            </div>
          )}

          {isNew && (
            <div className="absolute top-4 right-4">
              <Label
                theme="warning"
                size="s"
                style={{
                  backgroundColor: "#ffcc00",
                  color: "#000",
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                }}
              >
                <Flex gap={1} align="center">
                  <Icon data={CirclePlayFill} size={12} />
                  NEW
                </Flex>
              </Label>
            </div>
          )}

          {/* Информация снизу */}
          <div className="relative z-10 p-5 mt-auto">
            <Text
              variant="header-1"
              color="light"
              className="line-clamp-2 font-bold"
              ellipsis
            >
              {title}
            </Text>

            <Flex gap={2} align="center" className="mt-3">
              <Icon data={Calendar} size={16} className="text-gray-400" />
              <Text color="secondary" variant="body-2">
                {year}
              </Text>
            </Flex>
          </div>
        </div>

        {/* Ховер-эффект через group (Gravity UI поддерживает group-hover) */}
<div
  className="absolute inset-0 ring-2 ring-[#ffcc00] ring-inset opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
  style={{ boxShadow: '0 8px 32px rgba(255, 204, 0, 0.3)' }}
/>
      </Card>
    </Link>
  );
}

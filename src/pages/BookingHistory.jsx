import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

export default function BookingHistory() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Ошибка авторизации. Войдите заново");
          setLoading(false);
          return;
        }

        const res = await axios.get("/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(
          err.response?.data?.error || "Не удалось загрузить бронирования"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (!user) {
    return (
      <div className="container-centered py-32 text-center">
        <h1 className="text-5xl font-bold mb-8">История бронирований</h1>
        <p className="text-2xl text-text-secondary mb-12">
          Войдите в аккаунт, чтобы увидеть свои билеты
        </p>
        <Link
          to="/"
          className="inline-block bg-primary px-12 py-5 rounded-xl text-2xl font-bold hover:bg-primary-dark transition transform hover:scale-105 shadow-2xl"
        >
          На главную
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container-centered py-32 text-center">
        <div className="text-3xl">Загрузка ваших бронирований...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-centered py-32 text-center">
        <p className="text-2xl text-primary mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary px-10 py-4 rounded-xl text-xl font-bold hover:bg-primary-dark transition"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="container-centered py-12">
      <h1 className="text-5xl md:text-6xl font-bold mb-16 text-center">
        Мои билеты
      </h1>
      {user && user.provider === "yandex" && user.avatar && (
        <div className="flex items-center justify-center gap-3 mb-8">
          <img
            src={user.avatar}
            alt="Аватар Яндекс"
            className="w-16 h-16 rounded-full border-2 border-[#ffcc00]"
          />
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              {user.displayName || user.email}
            </h2>
            <span className="text-sm text-[#FFCC00]">Яндекс аккаунт</span>
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-32">
          <div className="text-6xl mb-8">🎬</div>
          <p className="text-3xl text-text-secondary mb-12">
            У вас пока нет забронированных билетов
          </p>
          <Link
            to="/movies"
            className="inline-block bg-primary px-12 py-5 rounded-xl text-2xl font-bold hover:bg-primary-dark transition transform hover:scale-105 shadow-2xl"
          >
            Выбрать фильм
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 justify-center max-w-6xl mx-auto">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-bg-secondary p-8 rounded-3xl shadow-2xl border border-gray-800 hover:border-primary transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-2xl font-bold text-primary pr-4">
                  {booking.title || booking.movieTitle || "Фильм"}
                </h3>
                <span className="text-4xl">🎟️</span>
              </div>

              <div className="space-y-4 text-lg">
                <div className="flex justify-between">
                  <span className="font-semibold text-text-secondary">
                    Имя:
                  </span>
                  <span>{booking.name || user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-text-secondary">
                    Билетов:
                  </span>
                  <span className="text-primary font-bold">
                    {booking.seats}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-text-secondary">
                    Дата:
                  </span>
                  <span>
                    {new Date(booking.createdAt).toLocaleDateString("ru-RU")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-text-secondary">
                    Время:
                  </span>
                  <span>
                    {new Date(booking.createdAt).toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700 text-center">
                <p className="text-sm text-text-secondary">
                  ID брони:{" "}
                  <span className="font-mono text-primary">{booking._id}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

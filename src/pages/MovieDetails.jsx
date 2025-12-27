import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const TMDB_API_KEY = "09d13e03c0c446ac654cd31df8281f63";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w1280";
const YOUTUBE_BASE = "https://www.youtube.com/embed/";

export default function MovieDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [formData, setFormData] = useState({ name: '', seats: 1 });
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [detailsRes, creditsRes, videosRes] = await Promise.all([
          fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=ru-RU`),
          fetch(`${TMDB_BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}`),
          fetch(`${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=ru-RU`)
        ]);

        if (!detailsRes.ok || !creditsRes.ok || !videosRes.ok) {
          throw new Error('Failed to fetch movie data');
        }

        const details = await detailsRes.json();
        const credits = await creditsRes.json();
        const videos = await videosRes.json();

        setMovie(details);
        setCredits(credits);
        setVideos(videos);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingStatus('');

    if (!user) {
      setBookingStatus('Войдите в аккаунт, чтобы бронировать билеты');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setBookingStatus('Ошибка авторизации. Войдите заново');
      return;
    }

    try {
      console.log('Отправляем бронь:', {
  title: movie?.title,
  movieId: movie?.id,
  date: new Date().toISOString(),
  seats: Number(formData.seats),
  name: formData.name || user.email,
});
try {
  await axios.post('https://diplomback.onrender.com/api/bookings', {
    title: movie?.title || 'Неизвестный фильм',
    movieTitle: movie?.title || 'Неизвестный фильм', // на случай, если в модели movieTitle
    movieId: movie?.id,
    date: new Date().toISOString(),
    seats: Number(formData.seats),
    name: formData.name || user.email || 'Анонимный пользователь',
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  setBookingStatus('Бронь успешно создана!');
  setFormData({ name: '', seats: 1 });
} catch (err) {
  console.error('Booking error:', err.response?.data || err.message);
  setBookingStatus(err.response?.data?.error || 'Ошибка при бронировании');
}

      setBookingStatus('Бронь успешно создана!');
      setFormData({ name: '', seats: 1 });
    } catch (err) {
      console.error('Booking error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.error || 'Ошибка при бронировании. Попробуйте позже';
      setBookingStatus(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="container-centered py-32 text-center">
        <div className="text-3xl">Загрузка фильма...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container-centered py-32 text-center">
        <div className="text-3xl text-primary">Фильм не найден</div>
      </div>
    );
  }

  const trailer = videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube");

  const tabs = [
    { id: 'about', label: 'О фильме' },
    { id: 'actors', label: 'Актёры' },
    { id: 'trailer', label: 'Трейлер' },
    { id: 'booking', label: 'Бронирование' },
  ];

  return (
    <div className="container-centered py-8">
      {/* Кнопка "Назад" — теперь правильно выровнена */}
      <Link 
        to="/movies" 
        className="inline-flex items-center gap-3 text-text-secondary hover:text-primary text-lg mb-10 transition font-medium"
      >
        <span className="text-2xl">←</span>
        Назад к фильмам
      </Link>

      {/* Постер + информация */}
      <div className="grid lg:grid-cols-3 gap-12 mb-16 items-start">
        <div className="lg:col-span-1 flex justify-center">
          <img
            src={
              movie.backdrop_path 
                ? `${IMAGE_BASE_URL}${movie.backdrop_path}` 
                : movie.poster_path 
                ? `${IMAGE_BASE_URL.replace('w1280', 'w780')}${movie.poster_path}`
                : 'https://via.placeholder.com/1280x720?text=Нет+изображения'
            }
            alt={movie.title}
            className="w-full max-w-4xl rounded-2xl shadow-2xl"
          />
        </div>

        <div className="lg:col-span-2">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center lg:text-left">
            {movie.title}
          </h1>

          <div className="flex flex-col items-center lg:items-start gap-8 mb-8">
            <div className="bg-primary text-black text-5xl font-bold w-32 h-32 rounded-full flex items-center justify-center shadow-2xl">
              {movie.vote_average ? movie.vote_average.toFixed(1) : '—'}
            </div>
            <div className="text-text-secondary text-xl text-center lg:text-left space-y-2">
              <p>{movie.release_date?.split('-')[0] || '—'}</p>
              <p>{movie.runtime ? `${movie.runtime} мин` : '—'}</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
            {movie.genres?.map(g => (
              <span key={g.id} className="bg-bg-secondary px-5 py-2 rounded-full text-sm">
                {g.name}
              </span>
            )) || <span className="text-text-secondary">Жанры не указаны</span>}
          </div>

          <p className="text-lg leading-relaxed text-text-secondary text-center lg:text-left">
            {movie.overview || 'Описание отсутствует.'}
          </p>
        </div>
      </div>

      {/* Вкладки */}
      <nav className="border-b border-gray-800 mb-12">
        <ul className="flex flex-wrap justify-center gap-8 -mb-px">
          {tabs.map(tab => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-1 text-xl font-medium transition relative ${
                  activeTab === tab.id
                    ? 'text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-primary'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Контент вкладок */}
      <div className="max-w-5xl mx-auto">
        {activeTab === 'about' && (
          <div className="text-lg text-text-secondary space-y-4 text-center lg:text-left">
            <p>{movie.overview || 'Полное описание отсутствует.'}</p>
            {movie.tagline && (
              <p className="text-2xl italic text-primary mt-8 text-center lg:text-left">«{movie.tagline}»</p>
            )}
          </div>
        )}

        {activeTab === 'actors' && credits?.cast && credits.cast.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8 justify-center">
            {credits.cast.slice(0, 16).map(actor => (
              <div key={actor.id} className="text-center">
                <img
                  src={
                    actor.profile_path 
                      ? `${IMAGE_BASE_URL.replace('w1280', 'w185')}${actor.profile_path}`
                      : 'https://via.placeholder.com/185x278?text=Нет+фото'
                  }
                  alt={actor.name}
                  className="w-full rounded-xl shadow-lg mb-3"
                />
                <p className="font-medium truncate">{actor.name}</p>
                <p className="text-sm text-text-secondary truncate">{actor.character || 'Роль не указана'}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'trailer' && trailer && (
          <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
            <iframe
              src={`${YOUTUBE_BASE}${trailer.key}?rel=0`}
              allowFullScreen
              className="w-full h-full"
              title="Трейлер фильма"
            ></iframe>
          </div>
        )}

        {activeTab === 'booking' && (
          <div className="max-w-2xl mx-auto bg-bg-secondary p-10 rounded-3xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-8 text-center">Бронирование билетов</h2>

            {bookingStatus && (
              <div className={`text-center text-xl mb-6 py-4 rounded-lg ${
                bookingStatus.includes('успешно') 
                  ? 'bg-green-900/50 text-green-300' 
                  : 'bg-red-900/50 text-primary'
              }`}>
                {bookingStatus}
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-8">
              <input
                type="text"
                placeholder="Ваше имя (необязательно)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-6 py-5 bg-bg-card rounded-xl text-gray-700 placeholder-text-secondary focus:outline-none focus:ring-4 focus:ring-primary/50"
              />

              <div>
                <label className="block text-text-secondary mb-3 text-lg text-center">
                  Количество мест
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.seats}
                  onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                  required
                  className="text-gray-700 w-full px-6 py-5 bg-bg-card rounded-xl  focus:outline-none focus:ring-4 focus:ring-primary/50"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-black py-6 rounded-xl text-2xl font-bold hover:bg-primary-dark transition transform hover:scale-105 shadow-2xl"
              >
                Забронировать билеты
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
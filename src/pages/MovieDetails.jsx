import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

import {
  Card,
  Text,
  Button,
  TextInput,
  Flex,
  Icon,
  Loader,
 
} from '@gravity-ui/uikit';

import { ArrowLeft, Star } from '@gravity-ui/icons';

const TMDB_API_KEY = "09d13e03c0c446ac654cd31df8281f63";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w1280";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w780";
const ACTOR_IMAGE_BASE = "https://image.tmdb.org/t/p/w185";
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
          fetch(`${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=ru-RU`),
        ]);

        const [details, creditsData, videosData] = await Promise.all([
          detailsRes.json(),
          creditsRes.json(),
          videosRes.json(),
        ]);

        setMovie(details);
        setCredits(creditsData);
        setVideos(videosData);
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
      // Добавьте полный URL к API
      await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/bookings`, {
        title: movie?.title || 'Неизвестный фильм',
        movieTitle: movie?.title || 'Неизвестный фильм',
        movieId: movie?.id,
        date: new Date().toISOString(),
        seats: Number(formData.seats),
        name: formData.name || user.email || 'Анонимный пользователь',
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setBookingStatus('Бронь успешно создана!');
      setFormData({ name: '', seats: 1 });
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Ошибка при бронировании. Попробуйте позже';
      setBookingStatus(errorMsg);
    }
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" className="py-32">
        <Loader size="l" />
        <Text variant="header-2" className="ml-4">Загрузка фильма...</Text>
      </Flex>
    );
  }

  if (!movie) {
    return (
      <Flex justifyContent="center" alignItems="center" className="py-32">
        <Text variant="header-2" color="danger">Фильм не найден</Text>
      </Flex>
    );
  }

  const trailer = videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube");
  const rating = movie.vote_average ? parseFloat(movie.vote_average.toFixed(1)) : 0;
  const isHighRating = rating > 7.0;

  const posterUrl = movie.backdrop_path
    ? `${IMAGE_BASE_URL}${movie.backdrop_path}`
    : movie.poster_path
    ? `${POSTER_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/1280x720?text=Нет+изображения';

  // Функция для отображения контента вкладок
  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="max-w-5xl mx-auto py-6">
            <Flex direction="column" gap={6} align="center" lg={{ align: 'start' }}>
              <Text variant="body-3" color="secondary">
                {movie.overview || 'Полное описание отсутствует.'}
              </Text>
              {movie.tagline && (
                <Text variant="header-2" color="warning" className="italic text-center lg:text-left">
                  «{movie.tagline}»
                </Text>
              )}
            </Flex>
          </div>
        );
      
      case 'actors':
        return (
          <div className="max-w-5xl mx-auto py-6">
            {credits?.cast?.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8">
                {credits.cast.slice(0, 16).map(actor => (
                  <div key={actor.id} className="text-center">
                    <Card view="raised" className="overflow-hidden mb-3">
                      <img
                        src={
                          actor.profile_path
                            ? `${ACTOR_IMAGE_BASE}${actor.profile_path}`
                            : 'https://via.placeholder.com/185x278?text=Нет+фото'
                        }
                        alt={actor.name}
                        className="w-full h-auto rounded-xl"
                      />
                    </Card>
                    <Text variant="subheader-1" ellipsis>{actor.name}</Text>
                    <Text variant="body-2" color="secondary" ellipsis>{actor.character || 'Роль не указана'}</Text>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'trailer':
        return (
          <div className="max-w-5xl mx-auto py-6">
            {trailer && (
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
                <iframe
                  src={`${YOUTUBE_BASE}${trailer.key}?rel=0`}
                  allowFullScreen
                  className="w-full h-full"
                  title="Трейлер фильма"
                />
              </div>
            )}
          </div>
        );
      
      case 'booking':
        return (
          <div className="max-w-5xl mx-auto py-6">
            <Card view="filled" theme="dark" className="max-w-2xl mx-auto p-10">
              <Text variant="header-2" className="mb-8 text-center">Бронирование билетов</Text>

              {bookingStatus && (
                <div className={`text-center text-xl mb-6 py-4 rounded-lg ${
                  bookingStatus.includes('успешно') || bookingStatus.includes('создана')
                    ? 'bg-green-900/50 text-green-300'
                    : 'bg-red-900/50 text-red-300'
                }`}>
                  {bookingStatus}
                </div>
              )}

              <form onSubmit={handleBooking}>
                <Flex direction="column" gap={6}>
                  <div>
                    {/* Используем Text как label */}
                    <Text variant="body-1" className="mb-2 block">Ваше имя (необязательно)</Text>
                    <TextInput
                      size="xl"
                      placeholder="Введите имя"
                      value={formData.name}
                      onUpdate={(value) => setFormData({ ...formData, name: value })}
                      controlProps={{
                        style: { backgroundColor: '#1a1a1a', borderColor: '#444' }
                      }}
                    />
                  </div>

                  <div>
                    <Text variant="body-1" className="mb-2 block">Количество мест</Text>
                    <TextInput
                      type="number"
                      size="xl"
                      min={1}
                      max={20}
                      value={formData.seats}
                      onUpdate={(val) => {
                        const num = Number(val);
                        setFormData({ ...formData, seats: isNaN(num) ? 1 : Math.max(1, num) });
                      }}
                      controlProps={{
                        style: { backgroundColor: '#1a1a1a', borderColor: '#444' }
                      }}
                    />
                  </div>

                  <Button
                    view="action"
                    size="xl"
                    type="submit"
                    style={{ backgroundColor: '#ffcc00', color: '#000' }}
                  >
                    Забронировать билеты
                  </Button>
                </Flex>
              </form>
            </Card>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4">
      <style>{`
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(255, 204, 0, 0.7); transform: scale(1); }
          70% { box-shadow: 0 0 20px 10px rgba(255, 204, 0, 0); transform: scale(1.05); }
          100% { box-shadow: 0 0 0 0 rgba(255, 204, 0, 0); transform: scale(1); }
        }
        .high-rating-animation {
          animation: pulse-glow 3s infinite ease-in-out;
        }
      `}</style>

      {/* Кнопка "Назад" */}
      <Link to="/movies" className="inline-flex items-center gap-3 mb-10">
        <Icon data={ArrowLeft} size={24} />
        <Text variant="header-1">Назад к фильмам</Text>
      </Link>

      {/* Основная информация */}
      <div className="grid lg:grid-cols-3 gap-12 mb-16 items-start">
        <div className="lg:col-span-1 flex justify-center">
          <Card view="raised" className="overflow-hidden">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-auto object-cover rounded-2xl"
            />
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Text variant="display-3" className="mb-8 text-center lg:text-left">
            {movie.title}
          </Text>

          <Flex gap={8} align="center" justify="center" direction={{ xs: 'column', lg: 'row' }} className="mb-8">
            {/* Красивый рейтинг с прозрачным фоном и анимацией */}
            <div
              className={`flex w-[150px] items-center justify-center gap-2 px-6 py-4 rounded-full border-4 border-[#ffcc00] bg-black/50 backdrop-blur-sm ${isHighRating ? 'high-rating-animation' : ''}`}
              style={{ minWidth: '140px' }}
            >
              <Icon data={Star} size={32} style={{ color: '#ffcc00' }} />
              <span className="text-4xl font-bold" style={{ color: '#ffcc00' }}>
                {rating || '—'}
              </span>
            </div>

            <Flex direction="column" gap={2} align="start" lg={{ align: 'start' }}>
              <Text variant="body-3" color="secondary">{movie.release_date?.split('-')[0] || '—'}</Text>
              <Text variant="body-3" color="secondary">{movie.runtime ? `${movie.runtime} мин` : '—'}</Text>
            </Flex>
          </Flex>

          {/* Жанры */}
          <Flex gap={2} wrap className="mb-8 justify-center lg:justify-start">
            {movie.genres?.map(g => (
              <span key={g.id} className="px-4 py-2 bg-[#333] rounded-full text-sm">
                {g.name}
              </span>
            ))}
          </Flex>

          <Text variant="body-3" color="secondary" className="leading-relaxed text-center lg:text-left">
            {movie.overview || 'Описание отсутствует.'}
          </Text>
        </div>
      </div>

      {/* Упрощенные вкладки */}
      <div className="mb-8">
        <div className="flex border-b border-gray-700 mb-8">
          {['about', 'actors', 'trailer', 'booking'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-lg font-medium transition-colors ${
                activeTab === tab 
                  ? 'border-b-2 border-yellow-400 text-yellow-400' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab === 'about' && 'О фильме'}
              {tab === 'actors' && 'Актёры'}
              {tab === 'trailer' && 'Трейлер'}
              {tab === 'booking' && 'Бронирование'}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
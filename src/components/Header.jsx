import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import { Button, TextInput, Icon, Tooltip, Avatar } from "@gravity-ui/uikit";
import { Magnifier, Ticket, Filmstrip, PersonFill } from "@gravity-ui/icons";

export default function Header() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout, refreshAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Обновляем состояние при изменении маршрута
  useEffect(() => {
    console.log('📍 Изменение маршрута:', location.pathname);
    // Небольшая задержка для гарантии обновления
    const timer = setTimeout(() => {
      refreshAuth?.();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location, refreshAuth]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  console.log('🎯 Header render, user:', user ? user.email : 'не авторизован');

  return (
    <header className="bg-[#0f0f0f] border-b border-gray-800 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
        <Link
          to="/"
          className="text-4xl font-bold text-[#ffcc00] tracking-wider hover:opacity-90 transition"
          onClick={() => refreshAuth?.()}
        >
          NEWKINO
        </Link>

        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center flex-1 max-w-2xl mx-8"
        >
          <div className="relative w-full">
            <TextInput
              size="xl"
              placeholder="Поиск фильмов, актёров..."
              value={searchQuery}
              onUpdate={(value) => setSearchQuery(value)}
              hasClear
              controlProps={{
                style: {
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  paddingLeft: "48px",
                },
              }}
            />
            <Icon
              data={Magnifier}
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </form>

        <Tooltip content="Каталог фильмов">
          <Link
            to="/movies"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition text-lg font-medium"
            onClick={() => refreshAuth?.()}
          >
            <Icon data={Filmstrip} size={24} />
            <span className="hidden sm:inline">Фильмы</span>
          </Link>
        </Tooltip>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Tooltip content="История покупок билетов">
                <Link
                  to="/history"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition text-lg font-medium"
                  onClick={() => refreshAuth?.()}
                >
                  <Icon data={Ticket} size={20} />
                  <span className="hidden sm:inline">Мои билеты</span>
                </Link>
              </Tooltip>

              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Аватар"
                    className="w-10 h-10 rounded-full border-2 border-[#ffcc00] object-cover"
                    onError={(e) => {
                      console.error('Ошибка загрузки аватара:', user.avatar);
                      e.target.src = 'https://via.placeholder.com/40/333/fff?text=Y';
                    }}
                  />
                ) : (
                  <Avatar
                    icon={PersonFill}
                    size="s"
                    className="bg-gray-700 border-2 border-[#ffcc00]"
                  />
                )}
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-white">
                    {user.displayName || user.email?.split('@')[0] || 'Пользователь'}
                  </div>
                  {user.provider === 'yandex' && (
                    <div className="text-xs text-[#FFCC00] flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFCC00">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.561 7.5h-2.5c-.481 0-.856.356-1.229.75-.375.394-.75.75-1.25.75s-.875-.356-1.25-.75c-.373-.394-.748-.75-1.229-.75h-2.5c.5 2.5 1.5 5 3.5 5.5-1.5.5-3 2.5-3 5.5h2.5c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5h2.5c0-3-1.5-5-3-5.5 2-.5 3-3 3.5-5.5z"/>
                      </svg>
                      Яндекс
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                view="outlined" 
                size="l" 
                onClick={() => {
                  logout();
                  // Дополнительное обновление
                  setTimeout(() => refreshAuth?.(), 500);
                }}
              >
                Выйти
              </Button>
            </>
          ) : (
            <Button 
              view="action" 
              size="l" 
              onClick={() => setShowModal(true)}
            >
              Войти
            </Button>
          )}
        </div>
      </div>

      {showModal && <AuthModal onClose={() => {
        setShowModal(false);
        refreshAuth?.(); // Обновляем после закрытия модалки
      }} />}
    </header>
  );
}
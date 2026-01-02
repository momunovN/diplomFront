import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import { Button, TextInput, Icon, Tooltip } from "@gravity-ui/uikit";  // Добавили Tooltip
import { Magnifier, Ticket } from "@gravity-ui/icons";
import { Filmstrip } from '@gravity-ui/icons';

export default function Header() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-[#0f0f0f] border-b border-gray-800 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
        <Link
          to="/"
          className="text-4xl font-bold text-[#ffcc00] tracking-wider hover:opacity-90 transition"
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

        {/* Кнопка "Фильмы" с тултипом */}
        <Tooltip content="Каталог фильмов">
          <Link
            to="/movies"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition text-lg font-medium"
          >
            <Icon data={Filmstrip} size={24} />
            <span className="hidden sm:inline">Фильмы</span>  {/* Текст скрыт на мобильных */}
          </Link>
        </Tooltip>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              {/* "Мои билеты" с тултипом */}
              <Tooltip content="История покупок билетов">
                <Link
                  to="/history"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition text-lg font-medium"
                >
                  <Icon data={Ticket} size={20} />
                  <span className="hidden sm:inline">Мои билеты</span>
                </Link>
              </Tooltip>

              <span className="text-gray-400 hidden sm:block">
                {user.email}
              </span>
              <Button view="outlined" size="l" onClick={logout}>
                Выйти
              </Button>
            </>
          ) : (
            <Button view="action" size="l" onClick={() => setShowModal(true)}>
              Войти
            </Button>
          )}
        </div>
      </div>

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </header>
  );
}
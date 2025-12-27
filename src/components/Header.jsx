import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthModal from "./AuthModal";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const [showModal, setShowModal] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
<header className="bg-dark sticky top-0 z-50 shadow-2xl">
  <div className="container-centered flex items-center justify-between py-4">
    {/* Логотип */}
    <Link to="/" className="text-4xl font-bold text-primary tracking-wider">
      NEWKINO
    </Link>

    {/* Поиск — только на десктопе */}
 <div className="hidden md:flex items-center bg-bg-secondary rounded-full px-6 py-3 flex-1 max-w-2xl mx-8 shadow-inner">
  <form onSubmit={(e) => {
    e.preventDefault();
    const q = e.target.search.value.trim();
    if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
  }} className="flex items-center w-full">
    <input 
      name="search"
      type="text" 
      placeholder="Поиск фильмов, актёров..." 
      className="bg-transparent text-white outline-none flex-1 placeholder-text-secondary text-lg"
    />
    <button type="submit" className="ml-3">
      <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  </form>
</div>

    {/* Авторизация */}
    <div className="flex items-center gap-6">
      {user ? (
        <>
          <Link to="/history" className="text-text-secondary hover:text-primary transition text-lg">
            Мои билеты
          </Link>
          <span className="text-text-secondary">{user.email}</span>
          <button
            onClick={logout}
            className="bg-primary px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition shadow-lg"
          >
            Выйти
          </button>
        </>
      ) : (
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition shadow-lg"
        >
          Войти
        </button>
      )}
    </div>
  </div>

  {showModal && <AuthModal onClose={() => setShowModal(false)} />}
</header>
  );
}

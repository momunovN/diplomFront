import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, register, yandexLogin } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = isLogin
      ? await login(email, password)
      : await register(email, password);

    if (result.success) {
      onClose();
      setEmail("");
      setPassword("");
    } else {
      setError(result.error);
    }
  };

  const handleYandexLogin = async () => {
    setError("");
    const result = await yandexLogin();
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-dark border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Крестик закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-3xl text-text-secondary hover:text-white transition"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold text-center mb-8">
          {isLogin ? "Вход в аккаунт" : "Регистрация"}
        </h2>

        {error && (
          <p className="text-primary text-center mb-6 bg-red-900/30 py-3 rounded-lg border border-primary/30">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-5 py-4 bg-bg-secondary border border-gray-700 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition text-white placeholder-text-secondary"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-5 py-4 bg-bg-secondary border border-gray-700 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition text-white placeholder-text-secondary"
          />
          
          <button
            type="submit"
            className="w-full bg-primary py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition transform hover:scale-105"
          >
            {isLogin ? "Войти" : "Создать аккаунт"}
          </button>
        </form>

        {/* Разделитель */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-dark text-gray-400">
              Или войдите через
            </span>
          </div>
        </div>

        {/* Кнопка Яндекс */}
        <button
          type="button"
          onClick={handleYandexLogin}
          className="w-full flex items-center justify-center gap-3 bg-[#FFCC00] text-black font-semibold py-3 px-4 rounded-lg hover:bg-[#FFD633] transition-colors disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.561 7.5h-2.5c-.481 0-.856.356-1.229.75-.375.394-.75.75-1.25.75s-.875-.356-1.25-.75c-.373-.394-.748-.75-1.229-.75h-2.5c.5 2.5 1.5 5 3.5 5.5-1.5.5-3 2.5-3 5.5h2.5c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5h2.5c0-3-1.5-5-3-5.5 2-.5 3-3 3.5-5.5z"/>
          </svg>
          Войти через Яндекс
        </button>

        <p className="text-center mt-8 text-text-secondary">
          {isLogin ? "Ещё нет аккаунта? " : "Уже есть аккаунт? "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-primary font-bold hover:underline"
          >
            {isLogin ? "Зарегистрироваться" : "Войти"}
          </button>
        </p>
      </div>
    </div>
  );
}
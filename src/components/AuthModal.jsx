import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function AuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = isLogin 
      ? await login(email, password)
      : await register(email, password);

    if (result.success) {
      onClose();
      setEmail('');
      setPassword('');
    } else {
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
          {isLogin ? 'Вход в аккаунт' : 'Регистрация'}
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
            {isLogin ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        <p className="text-center mt-8 text-text-secondary">
          {isLogin ? 'Ещё нет аккаунта? ' : 'Уже есть аккаунт? '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-primary font-bold hover:underline"
          >
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </p>
      </div>
    </div>
  );
}
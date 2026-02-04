import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Базовый URL из переменных окружения или localhost по умолчанию
const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Функция для обновления состояния пользователя
  const updateUser = (userData) => {
    setUser(userData);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Проверяем валидность токена на сервере
          const res = await axios.get(`${API_URL}/api/auth/check`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (res.data.isAuthenticated) {
            setUser(res.data.user);
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error('Auth check error:', err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: email.trim(),
        password: password,
      });

      const { token, user: userData } = res.data;

      localStorage.setItem('token', token);
      setUser(userData);

      return { success: true };
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || 'Неверный email или пароль';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        email: email.trim(),
        password: password,
      });

      const { token, user: userData } = res.data;

      localStorage.setItem('token', token);
      setUser(userData);

      return { success: true };
    } catch (err) {
      console.error('Register error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || 'Ошибка регистрации (возможно, email уже занят)';
      return { success: false, error: errorMessage };
    }
  };

  // Функция для входа через Яндекс
  const yandexLogin = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/yandex/url`);
      window.location.href = res.data.url;
    } catch (err) {
      console.error('Yandex login error:', err);
      return { success: false, error: 'Ошибка подключения к Яндекс' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser: updateUser, // Экспортируем setUser
      login, 
      register, 
      yandexLogin,
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
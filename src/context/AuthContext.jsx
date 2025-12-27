import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = 'https://diplomback.onrender.com/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('email');
    if (token && savedEmail) {
      setUser({ email: savedEmail });
    }
    setLoading(false);
  }, []);

const login = async (email, password) => {
  try {
    // Отправляем только email и password — чистый объект
    const res = await axios.post(`${API_URL}/login`, {
      email: email.trim(),
      password: password,
    });

    const { token, user: userData } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('email', userData.email);
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
    const res = await axios.post(`${API_URL}/register`, {
      email: email.trim(),
      password: password,
    });

    const { token, user: userData } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('email', userData.email);
    setUser(userData);

    return { success: true };
  } catch (err) {
    console.error('Register error:', err.response?.data || err.message);
    const errorMessage = err.response?.data?.error || 'Ошибка регистрации (возможно, email уже занят)';
    return { success: false, error: errorMessage };
  }
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
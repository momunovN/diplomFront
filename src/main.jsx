import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from '@gravity-ui/uikit';
import { configure } from '@gravity-ui/uikit';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import axios from 'axios';

// Настройка axios для продакшена
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://diplombackend-hbp1.onrender.com'  // ЗАМЕНИТЕ на ваш домен бэкенда
    : 'http://localhost:5000'
  );

axios.defaults.baseURL = API_URL;

// Добавляем interceptor для токена
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка ошибок
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Не перезагружаем сразу, даем пользователю возможность увидеть ошибку
      console.warn('Сессия истекла, требуется повторный вход');
    }
    return Promise.reject(error);
  }
);

// Настройка языка
configure({ lang: 'ru' });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme="dark">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
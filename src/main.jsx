import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from '@gravity-ui/uikit';
import { configure } from '@gravity-ui/uikit'; // для русского языка
// Правильные импорты стилей — напрямую из основного пакета
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';

// Настройка языка (опционально, но рекомендуется для русских текстов в компонентах)
configure({ lang: 'ru' });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme="dark">  {/* dark — идеально для твоей тёмной темы */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
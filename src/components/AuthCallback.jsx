import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, user } = useContext(AuthContext); // Добавили user для отслеживания

  useEffect(() => {
    const processAuth = async () => {
      try {
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        const provider = searchParams.get('provider');
        const displayName = searchParams.get('displayName');
        const avatar = searchParams.get('avatar');

        console.log('🔑 AuthCallback - параметры получены:', {
          token: token ? `Да (${token.substring(0, 20)}...)` : 'Нет',
          email,
          provider,
          displayName,
          hasAvatar: !!avatar
        });

        if (!token || !email) {
          console.error('❌ Отсутствуют обязательные параметры');
          throw new Error('Отсутствуют токен или email');
        }

        // 1. Сохраняем токен в localStorage
        localStorage.setItem('token', token);
        console.log('✅ Токен сохранен в localStorage');

        // 2. Устанавливаем заголовок для axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // 3. Получаем данные пользователя с сервера
        try {
          console.log('🔄 Запрос данных пользователя с сервера...');
          const checkResponse = await axios.get('/api/auth/check');
          
          if (checkResponse.data.isAuthenticated) {
            console.log('✅ Данные пользователя получены с сервера:', checkResponse.data.user);
            setUser(checkResponse.data.user);
          } else {
            console.warn('⚠️ Сервер не подтвердил авторизацию, использую локальные данные');
            const userData = { 
              email, 
              provider: provider || 'local',
              displayName: displayName || email.split('@')[0],
              avatar: avatar || null
            };
            setUser(userData);
          }
        } catch (checkError) {
          console.warn('⚠️ Ошибка проверки на сервере, использую локальные данные:', checkError.message);
          const userData = { 
            email, 
            provider: provider || 'local',
            displayName: displayName || email.split('@')[0],
            avatar: avatar || null
          };
          setUser(userData);
        }

        // 4. Ждем обновления состояния
        console.log('⏳ Ожидание обновления состояния...');
        setTimeout(() => {
          console.log('🔄 Перенаправление на главную...');
          navigate('/', { 
            replace: true,
            state: { 
              message: provider === 'yandex' 
                ? '✅ Успешный вход через Яндекс!' 
                : '✅ Добро пожаловать!' 
            }
          });
          
          // Принудительное обновление страницы
          setTimeout(() => {
            window.location.reload();
          }, 100);
          
        }, 500);

      } catch (err) {
        console.error('❌ Ошибка в AuthCallback:', err.message);
        
        setTimeout(() => {
          navigate('/', { 
            replace: true,
            state: { error: `Ошибка авторизации: ${err.message}` } 
          });
        }, 2000);
      }
    };

    processAuth();
  }, [searchParams, navigate, setUser]);

  // Отслеживаем обновление пользователя
  useEffect(() => {
    if (user) {
      console.log('👤 Пользователь обновлен в контексте:', user);
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black to-gray-900">
      <div className="text-center max-w-md mx-auto p-8 bg-black/50 backdrop-blur-sm rounded-3xl border border-[#ffcc00]/20">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-[#ffcc00] mx-auto mb-6"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-[#ffcc00] rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Авторизация успешна!</h2>
        <p className="text-gray-300 mb-4">Ваш аккаунт подключен</p>
        
        <div className="space-y-2 text-sm text-gray-400">
          <p>• Проверка данных пользователя</p>
          <p>• Сохранение сессии</p>
          <p>• Перенаправление на главную...</p>
        </div>
        
        <div className="mt-8 flex justify-center items-center gap-3">
          <div className="w-2 h-2 bg-[#ffcc00] rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-[#ffcc00] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-[#ffcc00] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
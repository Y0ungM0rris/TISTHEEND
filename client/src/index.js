import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios'; // Импортируем axios
import PORT from './config'; // Импортируем PORT из файла config
import App from './App';
import UserPage from './pages/userPage';
import AuthPage from './pages/authPage';
import AdminPage from './pages/adminPage';
import Header from './header';
import reportWebVitals from './reportWebVitals';
import ViewOne from './pages/viewOnePage';
import ViewTwo from './pages/viewTwoPage';
import MainPage from './pages/mainPage';
import ViewThree from './pages/ThreeViewPage'
import ErrorPage from './pages/errorPage';

// Функция для декодирования токена
const decodeToken = (token) => {
  const tokenParts = token.split('.');
  const decodedPayload = JSON.parse(atob(tokenParts[1]));
  return decodedPayload;
};

// Функция для получения role_id пользователя
const getUserRoleId = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decodedToken = decodeToken(token);
      const userId = decodedToken.userId;

      const response = await axios.get(`http://localhost:${PORT}/user_role_id?userId=${userId}`);
      return response.data.role_id;
    } catch (error) {
      console.error('Ошибка при получении role_id:', error);
      return null;
    }
  } else {
    console.error('JWT токен не найден');
    return null;
  }
};

const Root = () => {
  const [role_id, setRoleId] = useState(null);

  useEffect(() => {
    getUserRoleId().then(role_id => {
      setRoleId(role_id);
    });
  }, []);

  return (
    <React.StrictMode>
      <Header />
      <Router>
        <Routes>
          <Route path="/user" element={<UserPage />} />
          <Route path="/main" element={<MainPage />} />
          {role_id === 1 && <Route path="/admin" element={<AdminPage />} />}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/viewOne" element={<ViewOne />} />
          <Route path="/viewTwo" element={<ViewTwo />} />
          <Route path="/viewThree" element={<ViewThree />} />
          <Route path="/App" element={<App />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/" element={<MainPage />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);
reportWebVitals();

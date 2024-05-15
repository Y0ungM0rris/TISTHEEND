import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import PORT from './config';

const LogoutButton = () => {
  const [message, setMessage] = useState('');

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      const response = await axios.post(`http://localhost:${PORT}/logout`);
      setMessage(response.data.message);
    } catch (error) {
      console.error('Ошибка при выходе из аккаунта:', error);
      setMessage('Ошибка при выходе из аккаунта');
    }
  };

  // Проверяем наличие токена доступа в локальном хранилище
  const token = localStorage.getItem('token');

  // Если токен доступа отсутствует, не отображаем компонент
  if (!token) {
    return null;
  }
  

  return (
    <div>
      <Button variant="danger" onClick={handleLogout} >Выйти</Button>
    </div>
  );
};

export default LogoutButton;

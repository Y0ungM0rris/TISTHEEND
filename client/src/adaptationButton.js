import React, { useState } from 'react';

const TokenGenerator = () => {
  const [token, setToken] = useState('');

  const generateToken = () => {
    const newToken = Math.random().toString(36).substr(2); 

    localStorage.setItem('token', newToken);
    
    setToken(newToken);
  };

  return (
    <div>
      <button onClick={generateToken}>Создать токен</button>
      {token && (
        <div>
          <p>Сгенерированный токен: {token}</p>
          <p>Токен сохранен в локальном хранилище</p>
        </div>
      )}
    </div>
  );
};

export default TokenGenerator;

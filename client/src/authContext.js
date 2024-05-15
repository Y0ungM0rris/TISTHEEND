import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser, userId, setUserId }}> {/* Передаем userId в контекст аутентификации */}
      {children}
    </AuthContext.Provider>
  );
};

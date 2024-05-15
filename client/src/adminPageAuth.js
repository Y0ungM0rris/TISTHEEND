import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PORT from './config';

const decodeToken = (token) => {
    const tokenParts = token.split('.');
    const decodedPayload = JSON.parse(atob(tokenParts[1]));
    return decodedPayload;
};

const UserRoleIdComponent = () => {
    const [userRoleId, setUserRoleId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = decodeToken(token);
                const userId = decodedToken.userId;
                
                axios.get(`http://localhost:${PORT}/user_role_id?userId=${userId}`)
                    .then(response => {
                        setUserRoleId(response.data.role_id);
                        setLoading(false);
                    })
                    .catch(error => {
                        setError('Ошибка при получении role_id');
                        setLoading(false);
                    });
            } catch (error) {
                setError('Ошибка декодирования токена');
                setLoading(false);
            }
        } else {
            setError('JWT токен не найден');
            setLoading(false);
        }
    }, []);

    return (
        <div>
            {loading ? (
                <p>Загрузка...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <p>Role ID пользователя: {userRoleId}</p>
            )}
        </div>
    );
};

export default UserRoleIdComponent;

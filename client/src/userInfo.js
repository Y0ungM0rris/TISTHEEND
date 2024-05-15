import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PORT from './config';
import Image from 'react-bootstrap/Image';
//import './App.css';

const decodeToken = (token) => {
    const tokenParts = token.split('.');
    const decodedPayload = JSON.parse(atob(tokenParts[1]));
    return decodedPayload;
};

const UserInfo = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = decodeToken(token);
                const userId = parseInt(decodedToken.userId, 10);
                fetchUserInfo(userId);
            } catch (error) {
                setError('Ошибка декодирования токена');
                setLoading(false);
            }
        } else {
            setError('JWT токен не найден');
            setLoading(false);
        }
    }, []);

    const fetchUserInfo = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:${PORT}/user_info?userId=${userId}`);
            setUserInfo(response.data);
            setLoading(false);
        } catch (error) {
            setError('Ошибка при получении информации о пользователе');
            setLoading(false);
        }
    };

    return (
        <div>
            {loading ? (
                <p>Загрузка...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div className='UserInfo'>
                    {userInfo.user_photo && (
                        <div>
                            <Image src={`http://localhost:${PORT}/${userInfo.user_photo}`} thumbnail alt="User" style={{height: "30vw"}} />
                        </div>
                    )}
                    <div>
                        <h3>Имя пользователя: {userInfo.username}</h3>
                        <h3>Имя: {userInfo.name}</h3>
                        <h3>Роль: {userInfo.role_name}</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserInfo;

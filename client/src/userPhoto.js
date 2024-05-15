import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PORT from './config';

function decodeToken(token) {
    const tokenParts = token.split('.');
    const decodedPayload = JSON.parse(atob(tokenParts[1]));
    return decodedPayload;
}

function UserProfilePhoto() {
    const [userPhotoUrl, setUserPhotoUrl] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found');
            return;
        }
        const decodedToken = decodeToken(token);
        const userId = decodedToken.user_id;

        if (userId === undefined) {
            console.error('User ID is undefined');
            return;
        }

        const fetchUserPhoto = async () => {
            try {
                const response = await axios.get(`http://localhost:${PORT}/avatar/${userId}`);
                setUserPhotoUrl(response.data.avatar_path);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserPhoto();
    }, []);

    return (
        <div className="user-photo">
            {userPhotoUrl ? (
                <img src={`http://localhost:${PORT}/${userPhotoUrl}`} alt="User" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            ) : (
                <p>No photo available</p>
            )}
        </div>
    );
}

export default UserProfilePhoto;

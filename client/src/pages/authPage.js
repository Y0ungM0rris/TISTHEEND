import React, { useState, useEffect } from 'react';
import '../App.css';
import { createRoot } from 'react-dom/client'; 
import LoginForm from '../loginForm';
import RegisterForm from '../registerForm';
import ImgDescriptionOne from '../assets/login.svg';
import ImgDescriptionTwo from '../assets/register.svg';

function App() {
    const [loggedInEmail, setLoggedInEmail] = useState('');
    const [userId, setUserId] = useState(null);

    const handleLogin = (email, token) => {
        setLoggedInEmail(email);
        localStorage.setItem('token', token);
        const decodedToken = decodeToken(token);
        setUserId(decodedToken.userId);
        //history.push('/user');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {

            const decodedToken = decodeToken(token);
            setUserId(decodedToken.userId);
        }
    }, []); 

    const decodeToken = (token) => {
        const tokenParts = token.split('.');
        const decodedPayload = JSON.parse(atob(tokenParts[1]));
        return decodedPayload;
    };

    return (
        <div>
            <div className='authMain'>
                <div className='authImgConteiner'>
                <img src={ImgDescriptionTwo} style={{width: '15vw'}} alt="Мое изображение" className='descriptionBlockOneImg'/>
                <RegisterForm></RegisterForm>
                </div>
                <div>
                <img src={ImgDescriptionOne} style={{width: '15vw'}} alt="Мое изображение" className='descriptionBlockOneImg'/>
                {!loggedInEmail && <LoginForm onLogin={handleLogin} />}
                </div>
            </div>
        </div>
    );
}
createRoot(document.getElementById('root')).render(<App />);

export default App;

import React, { useState, useEffect } from 'react';
import '../App.css';
import { createRoot } from 'react-dom/client'; 
import OffAppointmentsAdd from '../offlineAppointmentAdd';
import OnAppointmentsAdd from '../onlineAppointmentAdd';
import Slider from '../slider';
import ItemCard from '../itemCard';
import ImgDescriptionOne from '../assets/descriptionBlockOne.png';
import BackImage from '../assets/back.png';

function Main() {
    const [userId, setUserId] = useState(null);
    const view_id = 1; 

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
            <Slider></Slider>
            <div className='descriptionBlockTwo'>
                <div className='cardList'>
                    <ItemCard></ItemCard>
                </div>
            </div>
            <div className='descriptionBlockOne'>
                <div className='descriptionBlockOneText'>
                    <div className='descriptionBlockOneTitle' style={{ marginBottom: '6vw' }}>
                        <h3>Title</h3>
                        <p>Герцог Кларенс считался смелым и энергичным командиром, его репутация привлекала многочисленных . </p>
                    </div>
                    <div className='descriptionBlockOneTitle'>
                        <h3>Title</h3>
                        <p>Герцог Кларенс считался смелым и энергичным командиром, его репутация привлекала многочисленных . </p>
                    </div>
                </div>
                <img src={ImgDescriptionOne} alt="Мое изображение" className='descriptionBlockOneImg'/>
            </div>
            <div className='descriptionBlockTwo'>
            </div>
        </div>
    );
}

createRoot(document.getElementById('root')).render(<Main />);

export default Main;

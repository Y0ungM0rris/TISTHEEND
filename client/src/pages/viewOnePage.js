import React, { useState, useEffect } from 'react';
import '../App.css';
import { createRoot } from 'react-dom/client'; 
import OffAppointmentsAdd from '../offlineAppointmentAdd';
import OnAppointmentsAdd from '../onlineAppointmentAdd';
import ViewPhoto from '../viewPhoto';
import TitleAnimation from '../titleAnimation';
import ExhibitsList from '../exhibitView';

function ViewOne() {
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
        <div className='ViewPage'>
            <ViewPhoto viewId={view_id} />
            <ExhibitsList viewId={view_id} />
            <h5 style={{ textAlign: 'center' }}><TitleAnimation></TitleAnimation></h5>
            <div className='ViewApp'>
                {userId && <OffAppointmentsAdd userId={userId} view_id={view_id} />}
                {userId && <OnAppointmentsAdd userId={userId} view_id={view_id}/>}
            </div>
        </div>
    );
}

createRoot(document.getElementById('root')).render(<ViewOne />);

export default ViewOne;

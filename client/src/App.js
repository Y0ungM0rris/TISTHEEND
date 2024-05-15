import React, { useState, useEffect } from 'react';
import './App.css';
import { createRoot } from 'react-dom/client'; 
import RegisterForm from './registerForm';
import OffAppointmentsAdd from './offlineAppointmentAdd';
import OnAppointmentsAdd from './onlineAppointmentAdd';
import LogoutButton from './logoutButton';
import OnPagination from './onlineAppointmentsEditPagination';
import OffPagination from './offlineAppointmentsEditPagination';
import OfflinePagination from './offlinePagination';
import OnlinePagination from './onlinePagination';
import AdminPageAuth from './adminPageAuth';
import AButton from './adaptationButton';

function App() {
    const [loggedInEmail, setLoggedInEmail] = useState('');
    const [userId, setUserId] = useState(null);
    const [offlineAppointmentsPerPage, setOfflineAppointmentsPerPage] = useState(5);
    const [offlineAppointments, setOfflineAppointments] = useState([]);
    const [currentPageOff, setCurrentPageOff] = useState(1);
    const [onlineAppointmentsPerPage, setOnlineAppointmentsPerPage] = useState(5);
    const [onlineAppointments, setOnlineAppointments] = useState([]);
    const [currentPageOn, setCurrentPageOn] = useState(1);

    const handleLogin = (email, token) => {
        setLoggedInEmail(email);
        localStorage.setItem('token', token);
        const decodedToken = decodeToken(token);
        setUserId(decodedToken.userId);
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

            <AdminPageAuth></AdminPageAuth>
            <RegisterForm></RegisterForm>
            <AButton></AButton>
            {loggedInEmail && <p>Вы вошли как: {loggedInEmail}</p>}
            {userId && <p>Ваш user_id: {userId}</p>}
            {userId && <OffAppointmentsAdd userId={userId} />}
            {userId && <OnAppointmentsAdd userId={userId} />}
            <LogoutButton />
            <div className='AdminPagination'>
                <div><OnPagination /></div>
                <div><OffPagination /></div>
            </div>
            <div>
                <OnlinePagination
                    onlineAppointmentsPerPage={onlineAppointmentsPerPage}
                    totalOnlineAppointments={onlineAppointments.length}
                    currentPage={currentPageOn}
                    setCurrentPage={setCurrentPageOn}
                />
            </div>
            <div>
                <OfflinePagination
                    offlineAppointmentsPerPage={offlineAppointmentsPerPage}
                    totalOfflineAppointments={offlineAppointments.length}
                    currentPage={currentPageOff}
                    setCurrentPage={setCurrentPageOff}
                />
            </div>
        </div>
    );
}

createRoot(document.getElementById('root')).render(<App />);

export default App;

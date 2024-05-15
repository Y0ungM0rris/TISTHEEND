import React, { useState, useEffect } from 'react';
import UpdateUsernameModal from '../usernameUpdate'; // Импортируем компонент
import OffAppointmentsList from '../offlineAppointmentsList';
import OnAppointmentsList from '../onlineAppointmentsList';
import '@fontsource/roboto/300.css';
import UpdateUsernameForm from '../usernameUpdate';
import UserImage from '../assets/slider_img_2.png';
import Image from 'react-bootstrap/Image';
import UserInfo from '../userInfo';
import axios from 'axios';
import UpdateUserPhoto from '../userPhototEdit';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Modal, Button, Form, Offcanvas } from 'react-bootstrap';
import UpdateNameModal from '../nameUpdate';
import ImgDescriptionOne from '../assets/settings.svg';
import '../App.css';
import PORT from '../config';

function UserPage() {
    const [userId, setUserId] = useState(null);
    const [showNameModal, setShowNameModal] = useState(false); // Используем отдельное состояние для модального окна имени
    const [showUsernameModal, setShowUsernameModal] = useState(false); 
    const [showExhibitModal, setShowExhibitModal] = useState(false); // Добавляем состояние для модального окна экспонатов
    const [exhibits, setExhibits] = useState([]);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = decodeToken(token);
            setUserId(decodedToken.userId);
        }
        fetchData(); // Вызываем функцию получения данных при загрузке компонента
    }, []);

    const decodeToken = (token) => {
        const tokenParts = token.split('.');
        const decodedPayload = JSON.parse(atob(tokenParts[1]));
        return decodedPayload;
    };

    const handleCloseNameModal = () => {
        setShowNameModal(false);
    };

    const handleShowNameModal = () => {
        setShowNameModal(true);
    };

    const handleCloseUsernameModal = () => {
        setShowUsernameModal(false);
    };

    const handleShowUsernameModal = () => {
        setShowUsernameModal(true);
    };

    const handleCloseExhibitModal = () => {
        setShowExhibitModal(false);
    };

    const handleShowExhibitModal = () => {
        setShowExhibitModal(true);
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:${PORT}/exhibit`);
            setExhibits(response.data);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    };

    return (
        <div className='UserPage'>
            <UserInfo />
            <Offcanvas show={showOffcanvas}  onHide={() => setShowOffcanvas(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Настройки</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className='SettingsButtons'>
                    <UpdateUserPhoto />
                    <Button style={{margin: "1vw 0 1vw 0"}} onClick={handleShowNameModal}>Изменить Имя</Button>
                    <UpdateNameModal show={showNameModal} handleClose={handleCloseNameModal} /> 
                    <Button onClick={handleShowUsernameModal}>Изменить Username</Button>
                    <UpdateUsernameModal show={showUsernameModal} handleClose={handleCloseUsernameModal} />
                </Offcanvas.Body>
            </Offcanvas>
            <Tabs
                defaultActiveKey="profile"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="home" title="Онлайн записи">
                <div className='d-flex justify-content-center align-items-center' style={{ height: '100%' }}>
                {userId && <OnAppointmentsList userId={userId} />}
                    </div>
                </Tab>
                <Tab eventKey="profile" title="Офлайн записи">
                    <div className='d-flex justify-content-center align-items-center' style={{ height: '100%' }}>
                    {userId && <OffAppointmentsList userId={userId} />}
                    </div>
                </Tab>
                <Tab eventKey="settings" title="Настройки профиля">
                <div className='d-flex justify-content-center align-items-center' style={{ height: '100%', padding: '2vw' }}>
                    <img src={ImgDescriptionOne} style={{width: '15vw'}} alt="Мое изображение" className='descriptionBlockOneImg'/>
                    <div className='UserPageList'>
                        <UpdateUserPhoto />
                        <Button variant="outline-primary" style={{margin: "3vw 0 3vw 0"}} onClick={handleShowNameModal}>Изменить Имя</Button>
                        <UpdateNameModal show={showNameModal} handleClose={handleCloseNameModal} /> 
                        <Button variant="outline-primary" onClick={handleShowUsernameModal}>Изменить Username</Button>
                        <UpdateUsernameModal show={showUsernameModal} handleClose={handleCloseUsernameModal} />
                    </div>
                </div>
                </Tab>
            </Tabs>
            <Modal show={showExhibitModal} onHide={handleCloseExhibitModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Экспонаты</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {exhibits.map(exhibit => (
                            <ListGroup.Item key={exhibit.exhibit_id}>
                                <strong>{exhibit.exhibit_name}</strong>: {exhibit.exhibit_description}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleCloseExhibitModal}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default UserPage;

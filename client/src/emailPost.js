import React, { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import PORT from './config';

function SendMessageToAllUsers() {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);

    const handleSendMessage = async () => {
        setShowConfirmation(false);
        try {
            const response = await axios.post(`http://localhost:${PORT}/send-message-to-all-users`);
            console.log(response.data); // Логика обработки успешного запроса
            setSuccessAlert(true);
        } catch (error) {
            console.error('Error sending message:', error); // Логика обработки ошибки
            setErrorAlert(true);
        }
    };

    return (
        <div>
            <Alert variant="success" show={successAlert} onClose={() => setSuccessAlert(false)} dismissible>
                Сообщение успешно отправлено всем пользователям!
            </Alert>

            <Alert variant="danger" show={errorAlert} onClose={() => setErrorAlert(false)} dismissible>
                Произошла ошибка при отправке сообщения!
            </Alert>
            <Button variant="primary" onClick={() => setShowConfirmation(true)}>Отправить сообщение всем пользователям</Button>

            <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение отправки</Modal.Title>
                </Modal.Header>
                <Modal.Body>Вы уверены, что хотите отправить сообщение всем пользователям?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmation(false)}>Отмена</Button>
                    <Button variant="primary" onClick={handleSendMessage}>Отправить</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default SendMessageToAllUsers;

import React, { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PORT from './config';

// Функция для декодирования JWT токена
const decodeToken = (token) => {
    const tokenParts = token.split('.');
    const decodedPayload = JSON.parse(atob(tokenParts[1]));
    return decodedPayload;
};

const UserPhotoUpdate = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [modalShow, setModalShow] = useState(false); // Состояние для отображения модального окна

    // Получение токена из локального хранилища
    const token = localStorage.getItem('token');

    // Извлечение user_id из токена
    const { userId } = decodeToken(token);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            setError('Please select a file');
            return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('photo', selectedFile);

        try {
            // Отправка файла на сервер для обновления фото пользователя
            const response = await axios.put(`http://localhost:${PORT}/update_user_photo/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            // Обновляем состояние или выполняем другие действия в случае успешного обновления
        } catch (error) {
            console.error('Error updating user photo:', error);
            setError('Error updating user photo');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <Button variant="outline-primary" onClick={() => setModalShow(true)}>Изменить фото</Button>

            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Изменить фото</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        <Button variant="outline-primary" type="submit" disabled={uploading}>Upload</Button>
                    </form>
                    {error && <p>{error}</p>}
                    {uploading && <p>Uploading...</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setModalShow(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserPhotoUpdate;

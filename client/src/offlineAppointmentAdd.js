import React, { useState } from 'react';
import axios from 'axios';
import PORT from './config';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';

// Функция декодирования токена
const decodeToken = (token) => {
  const tokenParts = token.split('.');
  const decodedPayload = JSON.parse(atob(tokenParts[1]));
  return decodedPayload;
};

function OffAppointmentsAddContainer({ userId, view_id }) {
  const [formData, setFormData] = useState({
    offline_date: new Date().toISOString().substr(0, 10)
  });
  const [status, setStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('User is not authenticated');
        setShowAlert(true);
        return;
      }
      
      const decodedToken = decodeToken(token);
      
      const response = await axios.post(`http://localhost:${PORT}/offline_appointments`, {
        user_id: decodedToken.userId, 
        views_id: view_id,
        offline_date: formData.offline_date
      });
      setStatus(response.data);
      setErrorMessage('');
      setShowAlert(true);
      setShowConfirmation(false);
    } catch (error) {
      console.error(error);
      setErrorMessage('Error creating offline appointment');
      setShowAlert(true);
    }
  };

  return (
    <div className='OnlineAppointmentAdd'>
      <h3>#офлайн</h3>
      {showAlert && (
        <Alert variant={errorMessage ? 'danger' : 'success'} onClose={() => setShowAlert(false)} dismissible>
          <Alert.Heading>{errorMessage ? 'Error' : 'Success'}</Alert.Heading>
          <p>{errorMessage || status}</p>
        </Alert>
      )}
      <form onSubmit={(e) => { e.preventDefault(); setShowConfirmation(true); }} className='OnlineAppointmentAddForm'>
        <input className='OnlineAppointmentAddInput' type="datetime-local" name="offline_date" placeholder="Offline Date" value={formData.offline_date} onChange={handleInputChange} />
        <Button variant="outline-success" type="submit">Записаться</Button>
      </form>
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Подтвердите оформление записи</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы хотите записаться на экскурсию?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleSubmit}>Записаться</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default OffAppointmentsAddContainer;

import React, { useState } from 'react';
import axios from 'axios';
import PORT from './config';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';

function OnAppointmentsAddContainer({ userId, view_id }) {
  const [formData, setFormData] = useState({
    online_date: new Date().toISOString().substr(0, 10) // Получаем текущую дату в формате YYYY-MM-DD
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:${PORT}/online_appointments`, {
        user_id: userId,
        views_id: view_id,
        online_date: formData.online_date
      });
      setStatus(response.data);
      setErrorMessage('');
      setShowAlert(true);
      setShowConfirmation(false); // Hide confirmation after successful submission
    } catch (error) {
      console.error(error);
      setErrorMessage('Error creating offline appointment');
      setShowAlert(true);
    }
  };

  return (
    <div className='OnlineAppointmentAdd'>
      <h3>#онлайн</h3>
      <Alert show={showAlert} variant={errorMessage ? 'danger' : 'success'} onClose={() => setShowAlert(false)} dismissible>
        <Alert.Heading>{errorMessage ? 'Error' : 'Success'}</Alert.Heading>
        <p>{errorMessage || status}</p>
      </Alert>
      <form onSubmit={handleSubmit}>
        <div className='OnlineAppointmentAddForm'>
          <input className='OnlineAppointmentAddInput' type="datetime-local" name="online_date" placeholder="Online Date" value={formData.online_date} onChange={handleInputChange} />
          <Button variant="outline-success" type="button" onClick={() => setShowConfirmation(true)}>Записаться</Button>
        </div>
      </form>
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to add this appointment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" onClick={handleSubmit}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default OnAppointmentsAddContainer;

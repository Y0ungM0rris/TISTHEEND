import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PORT from './config';
import './App.css';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const OffAppointmentsListContainer = ({ userId }) => {
  const [appointments, setAppointments] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    return date.toLocaleDateString('ru-RU', options);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:${PORT}/user_offline_appointments?userId=${userId}`);
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchData();
  }, [userId]);

  const handleDeleteAppointment = async (offline_id) => {
    try {
      const response = await axios.delete(`http://localhost:${PORT}/delete_offline_appointment`, {
        data: {
          user_id: userId,
          offline_id: offline_id
        }
      });
      console.log(response.data); // Ответ от сервера
      // Обновляем список записей после удаления
      const updatedAppointments = appointments.filter(appointment => appointment.offline_id !== offline_id);
      setAppointments(updatedAppointments);
      setAlertMessage('Appointment deleted successfully');
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleUpdateDate = async (offline_id, newDate) => {
    try {
      const response = await axios.put(`http://localhost:${PORT}/update_offline_appointment_date`, {
        offline_id: offline_id,
        new_date: newDate
      });
      console.log(response.data); // Ответ от сервера
      // Обновляем список записей после обновления
      const updatedAppointments = appointments.map(appointment => {
        if (appointment.offline_id === offline_id) {
          return { ...appointment, offline_date: newDate };
        }
        return appointment;
      });
      setAppointments(updatedAppointments);
      setShowConfirmation(false);
      setAlertMessage('Appointment date updated successfully');
    } catch (error) {
      console.error('Error updating appointment date:', error);
    }
  };

  const handleConfirmation = (action, appointmentId) => {
    setConfirmationAction(() => action);
    setSelectedAppointmentId(() => appointmentId);
    setShowConfirmation(true);
  };

  return (
    <div className=''>
      {alertMessage && <Alert variant="success">{alertMessage}</Alert>}
      <div>
        {appointments.map(appointment => (
          <li key={appointment.offline_id} style={{ listStyle: 'none'}}>
            <div className='offlineUserListItem'>
              <p>Дата: {formatDate(appointment.offline_date)}</p>
              <p>Статус: {appointment.offline_status}</p>
              <input className='OnlineAppointmentAddInput' type="datetime-local" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
              <Button variant="outline-primary" onClick={() => handleConfirmation('update', appointment.offline_id)}>Изменить дату</Button>
              <Button variant="outline-danger" onClick={() => handleConfirmation('delete', appointment.offline_id)}>Удалить</Button>
            </div>
          </li>
        ))}
      </div>
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы хотите {confirmationAction === 'delete' ? 'удалить' : 'изменить'} эту запись?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
            Закрыть
          </Button>
          <Button variant={confirmationAction === 'delete' ? 'danger' : 'primary'} onClick={() => confirmationAction === 'delete' ? handleDeleteAppointment(selectedAppointmentId) : handleUpdateDate(selectedAppointmentId, newDate)}>
            Подтвердить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OffAppointmentsListContainer;

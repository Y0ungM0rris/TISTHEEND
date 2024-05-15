import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PORT from './config';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const OnAppointmentsListContainer = ({ userId }) => {
  const [appointments, setAppointments] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

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
        const response = await axios.get(`http://localhost:${PORT}/user_online_appointments?userId=${userId}`);
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchData();
  }, [userId]);

  const handleDeleteAppointment = async (online_id) => {
    try {
      // Ask for confirmation
      handleConfirmation('delete', online_id);
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleUpdateDate = async (online_id, newDate) => {
    try {
      // Ask for confirmation
      handleConfirmation('update', online_id);
    } catch (error) {
      console.error('Error updating appointment date:', error);
    }
  };

  const handleConfirmation = (action, appointmentId) => {
    setConfirmationAction(action);
    setSelectedAppointmentId(appointmentId);
    setShowConfirmation(true);
  };

  const confirmAction = () => {
    if (confirmationAction === 'delete') {
      handleDeleteConfirmation(selectedAppointmentId);
    } else if (confirmationAction === 'update') {
      handleUpdateDateConfirmation(selectedAppointmentId, newDate);
    }
    setShowConfirmation(false);
  };

  const handleDeleteConfirmation = async (online_id) => {
    try {
      const response = await axios.delete(`http://localhost:${PORT}/delete_online_appointment`, {
        data: {
          user_id: userId,
          online_id: online_id
        }
      });
      console.log(response.data); // Server response
      // Update the list of appointments after deletion
      const updatedAppointments = appointments.filter(appointment => appointment.online_id !== online_id);
      setAppointments(updatedAppointments);
      setAlertMessage('Appointment deleted successfully');
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleUpdateDateConfirmation = async (online_id, newDate) => {
    try {
      const response = await axios.put(`http://localhost:${PORT}/update_online_appointment_date`, {
        online_id: online_id,
        new_date: newDate
      });
      console.log(response.data); // Server response
      // Update the list of appointments after update
      const updatedAppointments = appointments.map(appointment => {
        if (appointment.online_id === online_id) {
          return { ...appointment, online_date: newDate };
        }
        return appointment;
      });
      setAppointments(updatedAppointments);
      setAlertMessage('Appointment date updated successfully');
    } catch (error) {
      console.error('Error updating appointment date:', error);
    }
  };

  return (
    <div>
      {alertMessage && <Alert variant="success">{alertMessage}</Alert>}
      <div>
        {appointments.map(appointment => (
          <li key={appointment.online_id} className='offlineUserListItem' style={{width: '90vw'}}>
            <p>Дата: {formatDate(appointment.online_date)}</p>
            <p>Статус: {appointment.online_status}</p>
            <p>Ссылка на подключение к трансляции: {appointment.link}</p>
            <input className='OnlineAppointmentAddInput' type="datetime-local" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            <Button variant="outline-primary" onClick={() => handleUpdateDate(appointment.online_id, newDate)}>Изменить дату</Button>
            <Button variant="outline-danger" onClick={() => handleDeleteAppointment(appointment.online_id)}>Удалить</Button>
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
          <Button variant={confirmationAction === 'delete' ? 'danger' : 'primary'} onClick={confirmAction}>
            Подтвердить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OnAppointmentsListContainer;

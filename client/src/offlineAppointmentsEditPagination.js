import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from 'react-bootstrap/Pagination';
import PORT from './config';
import OfflinePagination from './offlinePagination';
import ListGroup from 'react-bootstrap/ListGroup';
import StatusEdit from './offlineStatusEdit';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './App.css';

const AppointmentsListContainer = () => {
  const [offlineAppointments, setOfflineAppointments] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [newDate, setNewDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const offlineAppointmentsPerPage = 5; // Количество офлайн-записей на странице

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
    const fetchOfflineAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:${PORT}/offline_appointments_list`);
        setOfflineAppointments(response.data);
      } catch (error) {
        console.error('Error fetching offline appointments:', error);
      }
    };

    fetchOfflineAppointments();
  }, []);

  const handleDeleteOfflineAppointment = async (offline_id) => {
    try {
      const response = await axios.delete(`http://localhost:${PORT}/delete_offline_appointment_admin`, {
        data: { offline_id }
      });
      console.log(response.data);
      const updatedAppointments = offlineAppointments.filter(appointment => appointment.offline_id !== offline_id);
      setOfflineAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error deleting offline appointment:', error);
    }
  };

  const handleUpdateOfflineAppointmentStatus = async (offline_id) => {
    try {
      const response = await axios.put(`http://localhost:${PORT}/update_offline_appointment_status`, {
        offline_id,
        new_status: selectedStatus
      });
      console.log(response.data);
      const updatedAppointments = offlineAppointments.map(appointment => {
        if (appointment.offline_id === offline_id) {
          return { ...appointment, offline_status: selectedStatus };
        }
        return appointment;
      });
      setOfflineAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error updating offline appointment status:', error);
    }
  };

  const handleUpdateDate = async (offline_id) => {
    try {
      const response = await axios.put(`http://localhost:${PORT}/update_offline_appointment_date`, {
        offline_id,
        new_date: newDate
      });
      console.log(response.data);
      const updatedAppointments = offlineAppointments.map(appointment => {
        if (appointment.offline_id === offline_id) {
          return { ...appointment, offline_date: newDate };
        }
        return appointment;
      });
      setOfflineAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error updating offline appointment date:', error);
    }
  };

  const renderOfflineAppointments = () => {
    const indexOfLastAppointment = currentPage * offlineAppointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - offlineAppointmentsPerPage;
    const currentAppointments = offlineAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

    return currentAppointments.map(appointment => (


      <li key={appointment.offline_id} style={{ marginBottom: "2vw" }}>
        <ListGroup>
          <ListGroup.Item><p>Пользователь ID: {appointment.user_id}</p></ListGroup.Item>
          <ListGroup.Item><p>Выставка ID: {appointment.views_id}</p></ListGroup.Item>
          <ListGroup.Item>
            <p>Дата: {formatDate(appointment.offline_date)}</p>
          </ListGroup.Item>
          <ListGroup.Item><p>Статус: {appointment.offline_status}</p></ListGroup.Item>
          <ListGroup.Item>
            <div className='AdminOfflinePaginationStatusEdit'>
              <div>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  {selectedStatus || 'Выберите статус'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSelectedStatus('Запланировано')}>Запланировано</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedStatus('Выполнено')}>Открыта</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedStatus('Выполнено')}>Выполнено</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedStatus('Отменено')}>Отменено</Dropdown.Item>
                  {/* Добавьте другие варианты статусов по мере необходимости */}
                </Dropdown.Menu>
              </Dropdown>
              </div>
              <Button variant="success" onClick={() => handleUpdateOfflineAppointmentStatus(appointment.offline_id)}>Обновить статус</Button>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className='AdminOfflinePaginationStatusEdit'>
          <Form.Group controlId="newDate">
      <Form.Control
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
      />
      </Form.Group>
        <Button variant="primary" onClick={() => handleUpdateDate(appointment.offline_id)}>
          Изменить дату
        </Button>

          </ListGroup.Item>
          <ListGroup.Item><Button variant="danger" onClick={() => handleDeleteOfflineAppointment(appointment.offline_id)}>Удалить</Button></ListGroup.Item>
        </ListGroup>
      </li>
    ));
  };


  return (
    <div>
      <ol className='AdmonOfflineList'>
        {renderOfflineAppointments()}
      </ol>
      <hr></hr>
      <OfflinePagination
        offlineAppointmentsPerPage={offlineAppointmentsPerPage}
        totalOfflineAppointments={offlineAppointments.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default AppointmentsListContainer;

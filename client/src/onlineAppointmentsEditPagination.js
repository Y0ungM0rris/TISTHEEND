import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from 'react-bootstrap/Pagination';
import PORT from './config';
import OnlinePagination from './onlinePagination';
import Dropdown from 'react-bootstrap/Dropdown'; // Import Dropdown from react-bootstrap
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';


const AppointmentsListContainer = () => {
  const [onlineAppointments, setOnlineAppointments] = useState([]);
  const [newLink, setNewLink] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [newDate, setNewDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const onlineAppointmentsPerPage = 5; // Количество онлайн-записей на странице

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

    const fetchOnlineAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:${PORT}/online_appointments_list`);
        setOnlineAppointments(response.data);
      } catch (error) {
        console.error('Error fetching online appointments:', error);
      }
    };

    fetchOnlineAppointments();
  }, []);

  const handleUpdateLink = async (online_id) => {
    try {
      const response = await axios.put(`http://localhost:${PORT}/update_online_appointment_link`, {
        online_id,
        new_link: newLink
      });
      console.log(response.data); // Ответ от сервера
      // Обновление списка записей после обновления ссылки
      const updatedAppointments = onlineAppointments.map(appointment => {
        if (appointment.online_id === online_id) {
          return { ...appointment, link: newLink };
        }
        return appointment;
      });
      setOnlineAppointments(updatedAppointments);
      setNewLink('');
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating link:', error);
      setErrorMessage('Error updating link');
    }
  };

  const handleDeleteOnlineAppointment = async (online_id) => {
    try {
      const response = await axios.delete(`http://localhost:${PORT}/delete_online_appointment_admin`, {
        data: { online_id }
      });
      console.log(response.data); // Ответ от сервера
      // Обновление списка записей после удаления
      const updatedAppointments = onlineAppointments.filter(appointment => appointment.online_id !== online_id);
      setOnlineAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error deleting online appointment:', error);
      setErrorMessage('Error deleting online appointment');
    }
  };

  const handleUpdateOnlineAppointmentDate = async (online_id) => {
    try {
      const response = await axios.put(`http://localhost:${PORT}/update_online_appointment_date_admin`, {
        online_id,
        new_date: newDate
      });
      console.log(response.data); // Ответ от сервера
      // Обновление списка записей после обновления даты
      const updatedAppointments = onlineAppointments.map(appointment => {
        if (appointment.online_id === online_id) {
          return { ...appointment, online_date: newDate };
        }
        return appointment;
      });
      setOnlineAppointments(updatedAppointments);
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating online appointment date:', error);
      setErrorMessage('Error updating online appointment date');
    }
  };

  const handleUpdateOnlineAppointmentStatus = async (online_id) => {
    try {
      const response = await axios.put(`http://localhost:${PORT}/update_online_appointment_status`, {
        online_id,
        new_status: 'Выполнено' // Always set the status to "Выполнено"
      });
      console.log(response.data); // Response from the server
      // Update the status in local state
      const updatedAppointments = onlineAppointments.map(appointment => {
        if (appointment.online_id === online_id) {
          return { ...appointment, online_status: 'Выполнено' };
        }
        return appointment;
      });
      setOnlineAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error updating online appointment status:', error);
    }
  };
  

  const renderOnlineAppointments = () => {
    const indexOfLastAppointment = currentPage * onlineAppointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - onlineAppointmentsPerPage;
    const currentAppointments = onlineAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  
    return currentAppointments.map(appointment => (
      <ListGroup.Item key={appointment.online_id} style={{ marginBottom: "2vw" }}>
        <ListGroup>
          <ListGroup.Item>Пользователь ID: {appointment.user_id}</ListGroup.Item>
          <ListGroup.Item>Выставка ID: {appointment.views_id}</ListGroup.Item>
          <ListGroup.Item>
            <p>Дата: {formatDate(appointment.online_date)}</p>
          </ListGroup.Item>
          <ListGroup.Item>Статус: {appointment.online_status}</ListGroup.Item>
          <ListGroup.Item>
            <div className='AdminOfflinePaginationStatusEdit'>
              <div>
                <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  {selectedStatus ? selectedStatus : 'Выберите статус'}
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
              <Button variant="success" onClick={() => handleUpdateOnlineAppointmentStatus(appointment.online_id)}>Обновить статус</Button>
            </div>
          </ListGroup.Item>
          <ListGroup.Item>Ссылка: {appointment.link}</ListGroup.Item>
          <ListGroup.Item className='AdminOfflinePaginationStatusEdit'>
          <Form.Group controlId="newLink">
            <Form.Control
              type="text"
              placeholder="New Link"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
            />
            </Form.Group>
            <Button variant="primary" onClick={() => handleUpdateLink(appointment.online_id)}>
              Изменить ссылку
            </Button>
            {errorMessage && <p>{errorMessage}</p>}
          </ListGroup.Item>
          <ListGroup.Item className='AdminOfflinePaginationStatusEdit'>
          <Form.Group controlId="newDate">
            <Form.Control
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            </Form.Group>
            <Button variant="primary" onClick={() => handleUpdateOnlineAppointmentDate(appointment.online_id)}>
              Изменить дату
            </Button>
          </ListGroup.Item>
          <ListGroup.Item>
            <Button variant="danger" onClick={() => handleDeleteOnlineAppointment(appointment.online_id)}>Удалить</Button>
          </ListGroup.Item>
        </ListGroup>
      </ListGroup.Item>
    ));
  };

  return (
    <div>
      <ul className='AdmonOfflineList'>
        {renderOnlineAppointments()}
      </ul>
      <hr></hr>
      <OnlinePagination
        onlineAppointmentsPerPage={onlineAppointmentsPerPage}
        totalOnlineAppointments={onlineAppointments.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );

};

export default AppointmentsListContainer;

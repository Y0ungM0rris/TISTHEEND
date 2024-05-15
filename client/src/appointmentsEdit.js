import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PORT from './config';

const AppointmentsListContainer = () => {
  const [offlineAppointments, setOfflineAppointments] = useState([]);
  const [onlineAppointments, setOnlineAppointments] = useState([]);
  const [newLink, setNewLink] = useState('');
  const [newDate, setNewDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchOfflineAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:${PORT}/offline_appointments_list`);
        setOfflineAppointments(response.data);
      } catch (error) {
        console.error('Error fetching offline appointments:', error);
      }
    };

    const fetchOnlineAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:${PORT}/online_appointments_list`);
        setOnlineAppointments(response.data);
      } catch (error) {
        console.error('Error fetching online appointments:', error);
      }
    };

    fetchOfflineAppointments();
    fetchOnlineAppointments();
  }, []);

  const handleUpdateLink = async (online_id) => {
    try {
      const response = await axios.put(`http://localhost:${PORT}/update_online_appointment_link`, {
        online_id,
        new_link: newLink
      });
      console.log(response.data); // Response from the server
      // Update appointments list after updating the link
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
      console.log(response.data); // Response from the server
      // Update appointments list after deletion
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
      console.log(response.data); // Response from the server
      // Update appointments list after updating the date
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

  const handleDeleteOfflineAppointment = async (offline_id) => {
    try {
      const response = await axios.delete(`http://localhost:${PORT}/delete_offline_appointment_admin`, {
        data: { offline_id }
      });
      console.log(response.data); // Response from the server
      // Update appointments list after deletion
      const updatedAppointments = offlineAppointments.filter(appointment => appointment.offline_id !== offline_id);
      setOfflineAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error deleting offline appointment:', error);
      setErrorMessage('Error deleting offline appointment');
    }
  };

  const handleUpdateOfflineAppointmentDate = async (offline_id) => {
    try {
      const response = await axios.put(`http://localhost:${PORT}/update_offline_appointment_date_admin`, {
        offline_id,
        new_date: newDate
      });
      console.log(response.data); // Response from the server
      // Update appointments list after updating the date
      const updatedAppointments = offlineAppointments.map(appointment => {
        if (appointment.offline_id === offline_id) {
          return { ...appointment, offline_date: newDate };
        }
        return appointment;
      });
      setOfflineAppointments(updatedAppointments);
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating offline appointment date:', error);
      setErrorMessage('Error updating offline appointment date');
    }
  };

  return (
    <div>
      <h2>Offline Appointments List</h2>
      <ul>
        {offlineAppointments.map(appointment => (
          <li key={appointment.offline_id}>
            <p>User ID: {appointment.user_id}</p>
            <p>Views ID: {appointment.views_id}</p>
            <p>Date: {appointment.offline_date}</p>
            <p>Status: {appointment.offline_status}</p>
            <button onClick={() => handleDeleteOfflineAppointment(appointment.offline_id)}>Delete</button>
            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            <button onClick={() => handleUpdateOfflineAppointmentDate(appointment.offline_id)}>Update Date</button>
          </li>
        ))}
      </ul>
      <h2>Online Appointments List</h2>
      <ul>
        {onlineAppointments.map(appointment => (
          <li key={appointment.online_id}>
            <p>User ID: {appointment.user_id}</p>
            <p>Views ID: {appointment.views_id}</p>
            <p>Date: {appointment.online_date}</p>
            <p>Status: {appointment.online_status}</p>
            <p>Link: {appointment.link}</p>
            <input
              type="text"
              placeholder="New Link"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
            />
            <button onClick={() => handleUpdateLink(appointment.online_id)}>Update Link</button>
            {errorMessage && <p>{errorMessage}</p>}
            <button onClick={() => handleDeleteOnlineAppointment(appointment.online_id)}>Delete</button>
            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            <button onClick={() => handleUpdateOnlineAppointmentDate(appointment.online_id)}>Update Date</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentsListContainer;

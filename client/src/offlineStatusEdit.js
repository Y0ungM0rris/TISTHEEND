import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import PORT from './config';

const UpdateOfflineAppointmentStatus = ({ offline_id }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [user_id, setUserId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedPayload = decodeToken(token);
      setUserId(decodedPayload.user_id);
    }
  }, []);

  const decodeToken = (token) => {
    const tokenParts = token.split('.');
    const decodedPayload = JSON.parse(atob(tokenParts[1]));
    return decodedPayload;
  };

  const handleStatusChange = async (status) => {
    setSelectedStatus(status);
    try {
      const response = await axios.put(`http://localhost:${PORT}/update_offline_appointment_status`, {
        offline_id,
        new_status: status,
        user_id
      });
      console.log(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating offline appointment status:', error);
      setErrorMessage('Error updating offline appointment status');
    }
  };

  return (
    <DropdownButton id="dropdown-basic-button" title={selectedStatus || 'Select Status'}>
      <Dropdown.Item onSelect={() => handleStatusChange('Status 1')}>Status 1</Dropdown.Item>
      <Dropdown.Item onSelect={() => handleStatusChange('Status 2')}>Status 2</Dropdown.Item>
      <Dropdown.Item onSelect={() => handleStatusChange('Status 3')}>Status 3</Dropdown.Item>
      {/* Add more dropdown items for each status option */}
      {errorMessage && <p>{errorMessage}</p>}
    </DropdownButton>
  );
};

export default UpdateOfflineAppointmentStatus;

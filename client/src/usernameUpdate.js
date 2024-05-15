import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import PORT from './config';

const UpdateUsernameModal = ({ show, handleClose }) => {
  const [userId, setUserId] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Извлекаем userId из токена при монтировании компонента
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      setUserId(decodedToken.userId);
    }
  }, []);

  const decodeToken = (token) => {
    const tokenParts = token.split('.');
    const decodedPayload = JSON.parse(atob(tokenParts[1]));
    return decodedPayload;
  };

  const handleUsernameChange = (event) => {
    setNewUsername(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:${PORT}/update_user_username`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, new_username: newUsername }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      // Handle successful update here
      console.log('Username updated successfully');
      handleClose();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Modal 
    show={show} 
    onHide={handleClose}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Username</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formNewUsername">
            <Form.Label>New Username</Form.Label>
            <Form.Control type="text" placeholder="Enter new username" value={newUsername} onChange={handleUsernameChange} />
          </Form.Group>
        </Form>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateUsernameModal;

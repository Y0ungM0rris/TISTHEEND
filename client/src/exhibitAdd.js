import React, { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import PORT from './config';

const AddExhibitFormWithPhoto = () => {
  const [exhibitData, setExhibitData] = useState({
    exhibit_name: '',
    exhibit_description: '',
    view_id: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExhibitData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select a file');
      setShowAlert(true);
      return;
    }

    setUploading(true);
    setError(null);
    setShowAlert(false);

    const formData = new FormData();
    formData.append('exhibit_photo', selectedFile);

    // Добавляем остальные поля данных формы в объект FormData
    Object.keys(exhibitData).forEach(key => {
        formData.append(key, exhibitData[key]);
    });

    try {
      const response = await axios.post(`http://localhost:${PORT}/exhibits_add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      setSuccessMessage('Exhibit added successfully');
      setShowAlert(true);
      setExhibitData({
        exhibit_name: '',
        exhibit_description: '',
        view_id: ''
      });
    } catch (error) {
      console.error('Error adding new exhibit with photo:', error);
      setError('Error adding new exhibit with photo');
      setShowAlert(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{width: '60vw'}}>
      <h2>Добавить экспонат</h2>
      {showAlert && (
        <Alert variant={error ? 'danger' : 'success'} onClose={() => setShowAlert(false)} dismissible>
          <Alert.Heading>{error ? 'Error' : 'Success'}</Alert.Heading>
          <p>{error ? error : successMessage}</p>
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="exhibitName">
          <Form.Label>Название</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter exhibit name"
            name="exhibit_name"
            value={exhibitData.exhibit_name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="exhibitDescription">
          <Form.Label>Описание</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter exhibit description"
            name="exhibit_description"
            value={exhibitData.exhibit_description}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="exhibitPhoto">
          <Form.Label>Фото</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            name="exhibit_photo"
            onChange={handleFileChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="viewId">
          <Form.Label>ID выставки</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter view ID"
            name="view_id"
            value={exhibitData.view_id}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Add Exhibit'}
        </Button>
      </Form>
    </div>
  );
};

export default AddExhibitFormWithPhoto;

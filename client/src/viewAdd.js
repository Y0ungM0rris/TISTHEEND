import React, { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PORT from './config';

const AddViewFormWithPhoto = () => {
  const [viewData, setViewData] = useState({
    view_name: '',
    view_description: '',
    exhibit_id: '',
    view_url: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setViewData(prevData => ({
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
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('photo', selectedFile);

    // Добавляем остальные поля данных формы в объект FormData
    Object.keys(viewData).forEach(key => {
        formData.append(key, viewData[key]);
    });

    try {
      const response = await axios.post(`http://localhost:${PORT}/views_add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      // Обновляем состояние или выполняем другие действия в случае успешного обновления
    } catch (error) {
      console.error('Error adding new view with photo:', error);
      setError('Error adding new view with photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="viewName">
          <Form.Label>Название</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter view name"
            name="view_name"
            value={viewData.view_name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="viewDescription">
          <Form.Label>Описание</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter view description"
            name="view_description"
            value={viewData.view_description}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="viewPhoto">
          <Form.Label>Фото</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            name="view_photo"
            onChange={handleFileChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="exhibitId">
          <Form.Label>ID экспоната</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter exhibit ID"
            name="exhibit_id"
            value={viewData.exhibit_id}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="viewUrl">
          <Form.Label>Ссылка</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter view URL"
            name="view_url"
            value={viewData.view_url}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Add View'}
        </Button>
      </Form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AddViewFormWithPhoto;

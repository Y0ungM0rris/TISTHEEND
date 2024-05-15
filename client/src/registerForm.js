import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import PORT from './config';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    photo: null
  });
  const [errors, setErrors] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    photo: ''
  });
  const [message, setMessage] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Сбросить ошибку при изменении значения поля
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithPhoto = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataWithPhoto.append(key, value);
    });

    // Валидация формы
    let valid = true;
    const newErrors = { ...errors };

    // Проверка имени
    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения';
      valid = false;
    }

    // Проверка имени пользователя
    if (!formData.username.trim()) {
      newErrors.username = 'Имя пользователя обязательно для заполнения';
      valid = false;
    }

    // Проверка email
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
      valid = false;
    }

    // Проверка пароля
    if (!formData.password.trim()) {
      newErrors.password = 'Пароль обязателен для заполнения';
      valid = false;
    }

    // Проверка фотографии
    if (!formData.photo) {
      newErrors.photo = 'Фотография обязательна для загрузки';
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(`http://localhost:${PORT}/register`, formDataWithPhoto, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      setError('Ошибка при регистрации. Пожалуйста, проверьте введенные данные и попробуйте еще раз. Или измените username'); // Замените текст на русский язык
    }
  };

  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}> 
        Регистрация
      </Button>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Регистрация
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Имя</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Введите имя" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
              />
              {errors.name && <Form.Text style={{ color: 'red' }}>{errors.name}</Form.Text>}
            </Form.Group>

            <Form.Group controlId="formBasicUsername">
              <Form.Label>Имя пользователя</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Введите имя пользователя" 
                name="username" 
                value={formData.username} 
                onChange={handleChange} 
              />
              {errors.username && <Form.Text style={{ color: 'red' }}>{errors.username}</Form.Text>}
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Электронная почта</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Введите email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
              />
              {errors.email && <Form.Text style={{ color: 'red' }}>{errors.email}</Form.Text>}
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Пароль</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Введите пароль" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
              />
              {errors.password && <Form.Text style={{ color: 'red' }}>{errors.password}</Form.Text>}
            </Form.Group>

            <Form.Group controlId="formBasicPhoto">
              <Form.Label>Фотография</Form.Label>
              <Form.Control 
                type="file" 
                name="photo" 
                onChange={handleFileChange} 
              />
              {errors.photo && <Form.Text style={{ color: 'red' }}>{errors.photo}</Form.Text>}
            </Form.Group>

            <Modal.Footer>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {message && <p>{message}</p>}
              <Button variant="primary" type="submit">
                Зарегистрироваться
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RegisterForm;

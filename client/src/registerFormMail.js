import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import PORT from './config';


const RegisterForm = () => {


let mail = require('mail').Mail({
  host: 'smtp.gmail.com',
  username: 'dmorev17@mail.ru',
  password: 'ybnM9bgMRkQ7VKYmCNbV'
  });
  mail.message({
  from: 'dmorev17@mail.ru',
  to: ['recipient@somewhere.org'],
  subject: 'Hello from Node.JS'
  })
  .body('Node speaks SMTP!')
  .send(function(err) {});


  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    photo: null // Добавлено поле для хранения загруженной фотографии
  });
  const [message, setMessage] = useState('');
  const [modalShow, setModalShow] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
  
    try {
      const response = await axios.post(`http://localhost:${PORT}/register`, formDataWithPhoto, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(response.data.message);

      // После успешной регистрации отправляем письмо на почту
      //MailService.sendTestMail(formData.email);

    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      setMessage('Ошибка при регистрации');
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
              <Form.Text className="text-muted">
                Мы никогда не будем делиться вашей электронной почтой с кем-либо еще.
              </Form.Text>
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
            </Form.Group>

            <Form.Group controlId="formBasicPhoto">
              <Form.Label>Фотография</Form.Label>
              <Form.Control 
                type="file" 
                name="photo" 
                onChange={handleFileChange} 
              />
            </Form.Group>

            <Modal.Footer>
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

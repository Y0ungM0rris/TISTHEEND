import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { Navigate } from 'react-router-dom'; // Import Navigate
import PORT from './config';

function LoginForm({ onLogin }) {
    const [loginFormData, setLoginFormData] = useState({
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [redirectToHome, setRedirectToHome] = useState(false); // State to control redirection

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:${PORT}/login`, loginFormData);
            const { email, token } = response.data;
            localStorage.setItem('token', token);
            document.cookie = `token=${token}; path=/`;
            onLogin(email, token);
            setRedirectToHome(true); // Set to true to trigger redirection
            window.location.reload();
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Произошла ошибка. Пожалуйста, попробуйте еще раз.');
            }
        }
    };

    const handleModalClose = () => {
        setModalShow(false);
        setErrorMessage('');
    };

    const handleModalShow = () => {
        setModalShow(true);
    };

    if (redirectToHome) {
        return <Navigate to="/user" />; // Redirect to home if redirectToHome is true
    }

    return (
        <>
            <Button variant="primary" onClick={handleModalShow}> 
                Вход
            </Button>

            <Modal
                show={modalShow}
                onHide={handleModalClose}
                size="md"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Вход</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleLoginSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите email"
                                name="email"
                                value={loginFormData.email}
                                onChange={(e) => setLoginFormData({ ...loginFormData, email: e.target.value })}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Введите пароль"
                                name="password"
                                value={loginFormData.password}
                                onChange={(e) => setLoginFormData({ ...loginFormData, password: e.target.value })}
                            />
                        </Form.Group>
                        <Modal.Footer>
                            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                            <Button variant="primary" type="submit">Войти</Button>
                        </Modal.Footer> 
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default LoginForm;

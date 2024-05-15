import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PORT from './config';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';


const UserInfo = () => {
    const [userInfo, setUserInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:${PORT}/all_users_info`);
                setUserInfo(response.data);
                setLoading(false);
            } catch (error) {
                setError('Ошибка при получении информации о пользователях');
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:${PORT}/delete_user?userId=${userId}`);
            // После успешного удаления пользователя обновляем список пользователей
            const response = await axios.get(`http://localhost:${PORT}/all_users_info`);
            setUserInfo(response.data);
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
        }
    };

    const handleUpdateUserRole = async (userId) => {
        if (!selectedRole) {
            console.error('Роль не выбрана');
            return;
        }
        try {
            await axios.put(`http://localhost:${PORT}/update_user_role`, { user_id: userId, role_id: selectedRole });
            setSuccessMessage('Роль пользователя успешно обновлена');
            setErrorMessage('');
            // Обновляем список пользователей после изменения роли
            const response = await axios.get(`http://localhost:${PORT}/all_users_info`);
            setUserInfo(response.data);
        } catch (error) {
            console.error('Ошибка при обновлении роли пользователя:', error);
            setSuccessMessage('');
            setErrorMessage('Ошибка при обновлении роли пользователя');
        }
    };

    return (
        <div>
            {loading ? (
                <p>Загрузка...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div>
                    {userInfo.map((user, index) => (
                        <div key={index} className='UserInfo'>
                            {user.user_photo && (
                                <div>
                                    <Image src={`http://localhost:${PORT}/${user.user_photo}`} thumbnail alt="User" style={{ height: "30vw" }} />
                                </div>
                            )}
                            <div>
                            <Table striped bordered hover>
                                <tbody>
                                    <tr>
                                        <th>Пользователь ID:</th>
                                        <th>{user.user_id}</th>
                                    </tr>
                                    <tr>
                                        <th>Имя пользователя:</th>
                                        <th>{user.username}</th>
                                    </tr>
                                    <tr>
                                        <th>Имя:</th>
                                        <th>{user.name}</th>
                                    </tr>
                                    <tr>
                                        <th>Роль:</th>
                                        <th>{user.role_name}</th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <Button variant="primary" onClick={() => handleUpdateUserRole(user.user_id)}>Обновить роль</Button>
                                        </th>
                                        <th>
                                            <Form.Select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                            </Form.Select>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <Button variant="danger" onClick={() => handleDeleteUser(user.user_id)}>Удалить пользователя</Button>
                                        </th>
                                    </tr>
                                </tbody>
                            </Table>
                                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserInfo;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PORT from './config';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import LogoutButton from './logoutButton';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import SplitButton from 'react-bootstrap/SplitButton';
import { Button } from 'react-bootstrap';

function BasicExample() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    async function fetchUserRole() {
      const role = await getUserRoleId();
      setUserRole(role);
    }

    fetchUserRole();
  }, []);

  // Функция для декодирования токена
const decodeToken = (token) => {
  const tokenParts = token.split('.');
  const decodedPayload = JSON.parse(atob(tokenParts[1]));
  return decodedPayload;
};

// Функция для получения role_id пользователя
const getUserRoleId = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decodedToken = decodeToken(token);
      const userId = decodedToken.userId;

      const response = await axios.get(`http://localhost:${PORT}/user_role_id?userId=${userId}`);
      return response.data.role_id;
    } catch (error) {
      console.error('Ошибка при получении role_id:', error);
      return null;
    }
  } else {
    console.error('JWT токен не найден');
    return null;
  }
};  

  const token = localStorage.getItem('token');

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/main">Дом - Музей</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Выставки" id="basic-nav-dropdown">
              <NavDropdown.Item href="/viewOne">Выставка 1</NavDropdown.Item>
              <NavDropdown.Item href="/viewTwo">Выставка 2</NavDropdown.Item>
              <NavDropdown.Item href="/viewThree">Выставка 3</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="ml-auto">
            {token ? null : <Nav.Link href="/auth">Авторизация</Nav.Link>}
            {!token ? null : (
              <SplitButton
                align={{ lg: 'start' }}
                title="Личный кабинет"
                id="dropdown-menu-align-responsive-2"
                href="/user"
              >
                <Dropdown.Item eventKey="1" href="/main">
                {userRole === 1 && (
                  <Button variant="warning" href="/admin">Админ панель</Button>
                )}
                </Dropdown.Item>
                <Dropdown.Item eventKey="1" href="/main">
                  <LogoutButton />
                </Dropdown.Item>
              </SplitButton>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;

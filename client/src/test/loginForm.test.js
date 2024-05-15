import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Импортируем MemoryRouter
import axios from 'axios';
import LoginForm from '../LoginForm';

// Мокаем axios.post
jest.mock('axios');

describe('LoginForm', () => {
    test('должен перенаправить после успешной попытки входа', async () => {
        const token = 'example_token';
        axios.post.mockResolvedValue({ data: { email: 'test@example.com', token } });

        const mockOnLogin = jest.fn();
        const { getByText, getByLabelText } = render(
            // Оборачиваем компонент в MemoryRouter
            <MemoryRouter>
                <LoginForm onLogin={mockOnLogin} />
            </MemoryRouter>
        );
        const loginButton = getByText('Вход');
        fireEvent.click(loginButton);

        const emailInput = getByLabelText('Email');
        const passwordInput = getByLabelText('Пароль');
        const submitButton = getByText('Войти');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', token);
        });
    });
});

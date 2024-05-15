import React from 'react';
import { render } from '@testing-library/react';
import RegisterForm from '../registerForm';
import '@testing-library/jest-dom';

describe('UserInfo component', () => {
  it('renders without crashing', () => {
    render(<RegisterForm />);
  });

});

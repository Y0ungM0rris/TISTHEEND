import React from 'react';
import { render } from '@testing-library/react';
import Header from '../header';
import '@testing-library/jest-dom';

describe('UserInfo component', () => {

  beforeEach(() => {
    localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJpYXQiOjE3MTUzNzUzMzYsImV4cCI6MTcxNTM3ODkzNn0.F4lnrek0hs3OIP147rJOSMylzES1P1eY-8xF_jxcqQU');
  });
  
  afterEach(() => {
    localStorage.removeItem('token');
  });
  

  it('renders without crashing', () => {
    render(<Header />);
  });

});

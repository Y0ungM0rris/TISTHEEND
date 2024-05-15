import React from 'react';
import { render } from '@testing-library/react';
import ViewInfo from '../viewInfo';
import '@testing-library/jest-dom';

describe('UserInfo component', () => {
  it('renders without crashing', () => {
    render(<ViewInfo />);
  });

});

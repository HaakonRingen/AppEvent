import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextField from './TextField';

describe('TextField Component', () => {
  const mockOnChange = jest.fn();

  it('should render the TextField component', () => {
    render(
      <TextField
        name="testName"
        placeholder="Enter text"
        value=""
        onChange={mockOnChange}
      />
    );
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should display the correct value', () => {
    render(
      <TextField
        name="testName"
        placeholder="Enter text"
        value="Test value"
        onChange={mockOnChange}
      />
    );
    expect(screen.getByDisplayValue('Test value')).toBeInTheDocument();
  });

  it('should call onChange when the input value changes', () => {
    render(
      <TextField
        name="testName"
        placeholder="Enter text"
        value=""
        onChange={mockOnChange}
      />
    );
    const input = screen.getByPlaceholderText('Enter text');
    fireEvent.change(input, { target: { value: 'New value' } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
});
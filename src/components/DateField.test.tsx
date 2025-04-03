import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DateField from './DateField';

describe('DateField Component', () => {
  it('renders correctly with given props', () => {
    render(
      <DateField 
        placeholder="Select date and time" 
        value="2023-10-10T10:00" 
        onChange={() => {}} 
        minDate="2023-01-01T00:00" 
      />
    );

    const inputElement = screen.getByPlaceholderText("Select date and time");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue("2023-10-10T10:00");
    expect(inputElement).toHaveAttribute("min", "2023-01-01T00:00");
  });

  it('calls onChange when the value is changed', () => {
    const handleChange = jest.fn();
    render(
      <DateField 
        placeholder="Select date and time" 
        value="2023-10-10T10:00" 
        onChange={handleChange} 
        minDate="2023-01-01T00:00" 
      />
    );

    const inputElement = screen.getByPlaceholderText("Select date and time");
    fireEvent.change(inputElement, { target: { value: "2023-12-12T12:00" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('renders with the correct type', () => {
    render(
      <DateField 
        placeholder="Select date and time" 
        value="2023-10-10T10:00" 
        onChange={() => {}} 
        minDate="2023-01-01T00:00" 
      />
    );

    const inputElement = screen.getByPlaceholderText("Select date and time");
    expect(inputElement).toHaveAttribute("type", "datetime-local");
  });
});
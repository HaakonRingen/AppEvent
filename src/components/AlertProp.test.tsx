import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Alert from './AlertProp';

describe('Alert Component', () => {
  it('renders the alert message correctly', () => {
    render(<Alert message="Test message" onClose={() => {}} type="success" />);
    
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it('applies the correct styles for success type', () => {
    render(<Alert message="Success message" onClose={() => {}} type="success" />);
    
    const alertElement = screen.getByText("Success message").parentElement;
    expect(alertElement).toHaveClass('bg-green-100 border-green-400 text-green-700');
  });
  
  it('applies the correct styles for error type', () => {
    render(<Alert message="Error message" onClose={() => {}} type="error" />);
    
    const alertElement = screen.getByText("Error message").parentElement;
    expect(alertElement).toHaveClass('bg-red-100 border-red-400 text-red-700');
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = jest.fn();
    render(<Alert message="Close me" onClose={onClose} type="success" />);
    
    fireEvent.click(screen.getByText('×'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
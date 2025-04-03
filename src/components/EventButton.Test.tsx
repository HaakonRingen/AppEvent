import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventButton from './EventButton';

describe('EventButton Component', () => {
  const mockOnClick = jest.fn();

  it('should render the EventButton component', () => {
    render(
      <EventButton
        onClick={mockOnClick}
        label="Test Button"
      />
    );
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('should call onClick when the button is clicked', () => {
    render(
      <EventButton
        onClick={mockOnClick}
        label="Test Button"
      />
    );
    fireEvent.click(screen.getByText('Test Button'));
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should render the button with the correct label', () => {
    const { rerender } = render(
      <EventButton
        onClick={mockOnClick}
        label="First Label"
      />
    );
    expect(screen.getByText('First Label')).toBeInTheDocument();

    rerender(
      <EventButton
        onClick={mockOnClick}
        label="Second Label"
      />
    );
    expect(screen.getByText('Second Label')).toBeInTheDocument();
  });
});
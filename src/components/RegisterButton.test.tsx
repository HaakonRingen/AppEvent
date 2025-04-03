import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import '@testing-library/jest-dom';
import RegisterButton from './RegisterButton';
import translations from '../translations';

describe('RegisterButton Component', () => {
  const mockOnRegister = jest.fn();
  const eventId = '123';

  beforeEach(() => {
    jest.clearAllMocks();
});

  it('should render the RegisterButton component', () => {
    render(
      <RegisterButton
        eventId={eventId}
        onRegister={mockOnRegister}
      />
    );
    expect(screen.getByText('Meld på')).toBeInTheDocument();
  });

  it('should display the correct text based on language', () => {
    render(
      <RegisterButton
        eventId={eventId}
        onRegister={mockOnRegister}
      />
    );
    expect(screen.getByText(translations.no.join)).toBeInTheDocument();
  });

  it('should call onRegister with the correct eventId when clicked', () => {
    render(
      <RegisterButton
        eventId={eventId}
        onRegister={mockOnRegister}
      />
    );
    fireEvent.click(screen.getByText(translations.no.join));
    expect(mockOnRegister).toHaveBeenCalledWith(eventId);
  });
});
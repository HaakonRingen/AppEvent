import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import '@testing-library/jest-dom';
import DeleteButton from './DeleteButton';
import { useLanguage } from '../context/LanguageContext';
import translations from '../translations';


describe('DeleteButton Component', () => {
  const mockOnDelete = jest.fn();
  const eventId = '123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the DeleteButton component', () => {
    render(
      <DeleteButton
        eventId={eventId}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText(translations.no.delete)).toBeInTheDocument();
  });

  it('should call onDelete with the correct eventId when clicked', () => {
    render(
      <DeleteButton
        eventId={eventId}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.click(screen.getByText(translations.no.delete));
    expect(mockOnDelete).toHaveBeenCalledWith(eventId);
  });
});
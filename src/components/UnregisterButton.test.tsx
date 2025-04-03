import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import '@testing-library/jest-dom';
import UnregisterButton from './UnregisterButton';
import translations from '../translations';

describe('UnregisterButton Component', () => {
  const mockOnUnregister = jest.fn();
  const eventId = '123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the UnregisterButton component', () => {
    render(
      <UnregisterButton
        eventId={eventId}
        onUnregister={mockOnUnregister}
      />
    );
    expect(screen.getByText("Meld av")).toBeInTheDocument();
  });


  it('should call onUnregister with the correct eventId when clicked', () => {
    render(
      <UnregisterButton
        eventId={eventId}
        onUnregister={mockOnUnregister}
      />
    );
    fireEvent.click(screen.getByText("Meld av"));
    expect(mockOnUnregister).toHaveBeenCalledWith(eventId);
  });
});
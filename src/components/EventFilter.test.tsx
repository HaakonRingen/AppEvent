import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import '@testing-library/jest-dom';
import EventFilter from './EventFilter';
import { useLanguage } from '../context/LanguageContext';
import translations, { getEventCategories } from '../translations';



describe('EventFilter Component', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the EventFilter component', () => {
    render(
      <EventFilter onFilterChange={mockOnFilterChange} />
    );
    expect(screen.getByText(translations.no.filterEvents)).toBeInTheDocument();
  });

  

  it('should reset filters and call onFilterChange', () => {
    render(
      <EventFilter onFilterChange={mockOnFilterChange} />
    );
    const resetButton = screen.getByText(translations.no.resetFilters);
    fireEvent.click(resetButton);
    expect(mockOnFilterChange).toHaveBeenCalledWith({ date: '', place: '', category: '', search: '' });
  });
});
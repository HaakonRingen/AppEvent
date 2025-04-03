import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BackButton from './BackButton';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import translations from '../translations';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../context/LanguageContext', () => ({
  useLanguage: jest.fn(),
}));

describe('BackButton Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useLanguage as jest.Mock).mockReturnValue({ language: 'no' });
  });

  it('should render the BackButton component with default text', () => {
    render(<BackButton />);
    expect(screen.getByText(`← ${translations.no.back}`)).toBeInTheDocument();
  });

  it('should render the BackButton component with provided text', () => {
    render(<BackButton text="Go Back" />);
    expect(screen.getByText('← Go Back')).toBeInTheDocument();
  });

  it('should call router.push with the correct path when clicked', () => {
    render(<BackButton to="/test-path" />);
    fireEvent.click(screen.getByText(`← ${translations.no.back}`));
    expect(mockPush).toHaveBeenCalledWith('/test-path');
  });
});
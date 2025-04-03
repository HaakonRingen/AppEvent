import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import Navbar from './Navbar';
import useAuth from '../hooks/useAuth';
import { auth } from '../app/firebase';
import translations from '../translations';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(),
}));

jest.mock('../hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../app/firebase', () => ({
  auth: {},
}));

describe('Navbar Component', () => {
  const mockPush = jest.fn();
  const mockIsLoggedIn = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAuth as jest.Mock).mockReturnValue({ user: {}, isLoggedIn: mockIsLoggedIn });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render login button when user is not logged in', () => {
    mockIsLoggedIn.mockReturnValue(false);
    render(<Navbar />);
    expect(screen.getByText('Logg inn')).toBeInTheDocument();
  });

  it('should call signOut and redirect to home on logout', async () => {
    mockIsLoggedIn.mockReturnValue(true);
    render(<Navbar />);
    fireEvent.click(screen.getByText('Logg ut'));
    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith(auth);
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('navigates to register page when "Registrer" button is clicked', () => {
    mockIsLoggedIn.mockReturnValue(false);
    render(<Navbar />);
    fireEvent.click(screen.getByText('Registrer'));
    expect(mockPush).toHaveBeenCalledWith('/register');
  });

  it('navigates to login page when "Logg inn" button is clicked', () => {
    mockIsLoggedIn.mockReturnValue(false);
    render(<Navbar />);
    fireEvent.click(screen.getByText('Logg inn'));
    expect(mockPush).toHaveBeenCalledWith('/login');
  });


  it('renders user-specific buttons when logged in', () => {
    mockIsLoggedIn.mockReturnValue(true);
    render(<Navbar />);
    expect(screen.getByText('Logg ut')).toBeInTheDocument();
  });
});
import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import '@testing-library/jest-dom';
import EventModal from './EventModal';
import { useLanguage } from '../context/LanguageContext';
import translations from '../translations';


describe('EventModal Component', () => {
  const mockCloseModal = jest.fn();
  const mockHandleUnregister = jest.fn();
  const mockHandleRegister = jest.fn();
  const mockHandleDelete = jest.fn();
  const mockHandleAccept = jest.fn();
  const mockHandleDecline = jest.fn();

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 1); // Sett datoen til en dag frem i tid

  const event = {
    id: '1',
    title: 'Test Event',
    description: 'This is a test event',
    location: 'Test Location',
    type: 'public',
    when: futureDate.toISOString(),
    owner: 'user1',
    isPrivate: false,
    attendees: [],
    invitedUsers: [],
  };

  const user = {
    uid: 'user1',
    firebaseUser: { email: 'user1@test.com' },
    firestoreData: {
      registeredEvents: [],
      invitedEvents: [],
      isAdmin: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the EventModal component', () => {
    render(
      <EventModal
        event={event}
        user={user}
        closeModal={mockCloseModal}
      />
    );
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('This is a test event')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  it('should call closeModal when close button is clicked', () => {
    render(
      <EventModal
        event={event}
        user={user}
        closeModal={mockCloseModal}
      />
    );
    fireEvent.click(screen.getByText('×'));
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('should render RegisterButton when user is not registered and event is not private', () => {
    render(
      <EventModal
        event={event}
        user={user}
        handleRegister={mockHandleRegister}
        closeModal={mockCloseModal}
      />
    );
    expect(screen.getByText(translations.no.join)).toBeInTheDocument();
  });

  it('should render UnregisterButton when user is registered', () => {
    const registeredUser = {
      ...user,
      firestoreData: {
        ...user.firestoreData,
        registeredEvents: [event.id],
      },
    };
    render(
      <EventModal
        event={event}
        user={registeredUser}
        handleUnregister={mockHandleUnregister}
        closeModal={mockCloseModal}
      />
    );
    expect(screen.getByText(translations.no.unregister)).toBeInTheDocument();
  });

  it('should render DeleteButton when user is owner or admin', () => {
    render(
      <EventModal
        event={event}
        user={user}
        handleDelete={mockHandleDelete}
        closeModal={mockCloseModal}
      />
    );
    expect(screen.getByText(translations.no.delete)).toBeInTheDocument();
  });

  it('should call handleRegister when RegisterButton is clicked', () => {
    render(
      <EventModal
        event={event}
        user={user}
        handleRegister={mockHandleRegister}
        closeModal={mockCloseModal}
      />
    );
    fireEvent.click(screen.getByText(translations.no.join));
    expect(mockHandleRegister).toHaveBeenCalledWith(event.id);
  });

  it('should call handleUnregister when UnregisterButton is clicked', () => {
    const registeredUser = {
      ...user,
      firestoreData: {
        ...user.firestoreData,
        registeredEvents: [event.id],
      },
    };
    render(
      <EventModal
        event={event}
        user={registeredUser}
        handleUnregister={mockHandleUnregister}
        closeModal={mockCloseModal}
      />
    );
    fireEvent.click(screen.getByText(translations.no.unregister));
    expect(mockHandleUnregister).toHaveBeenCalledWith(event.id);
  });

  it('should call handleDelete when DeleteButton is clicked', () => {
    render(
      <EventModal
        event={event}
        user={user}
        handleDelete={mockHandleDelete}
        closeModal={mockCloseModal}
      />
    );
    fireEvent.click(screen.getByText(translations.no.delete));
    expect(mockHandleDelete).toHaveBeenCalledWith(event.id);
  });

 
});
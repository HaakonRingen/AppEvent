import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import '@testing-library/jest-dom';
import EventCard from './EventCard';
import { useLanguage } from '../context/LanguageContext';
import translations from '../translations';



describe('EventCard Component', () => {
  const mockHandleUnregister = jest.fn();
  const mockHandleRegister = jest.fn();
  const mockHandleDelete = jest.fn();
  const mockHandleEdit = jest.fn();
  const mockHandleAccept = jest.fn();
  const mockHandleDecline = jest.fn();

  const event = {
    id: '1',
    title: 'Test Event',
    description: 'This is a test event',
    location: 'Test Location',
    type: 'public',
    when: new Date().toISOString(),
    category: 'Test Category',
    owner: 'user1',
    isPrivate: false,
    attendees: [],
    invitedUsers: [],
    imageUrl: '',
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

  it('should render the EventCard component', () => {
    render(
      <EventCard
        event={event}
        user={user}
      />
    );
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('This is a test event')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  it('should render RegisterButton when user is not registered and event is not private', () => {
    render(
      <EventCard
        event={event}
        user={user}
        handleRegister={mockHandleRegister}
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
      <EventCard
        event={event}
        user={registeredUser}
        handleUnregister={mockHandleUnregister}
        allowUnregister={true}
      />
    );
    expect(screen.getByText(translations.no.unregister)).toBeInTheDocument();
  });

  it('should render DeleteButton when user is owner or admin', () => {
    render(
      <EventCard
        event={event}
        user={user}
        handleDelete={mockHandleDelete}
      />
    );
    expect(screen.getByText(translations.no.delete)).toBeInTheDocument();
  });

  it('should render EditButton when user is owner or admin', () => {
    render(
      <EventCard
        event={event}
        user={user}
        handleEdit={mockHandleEdit}
      />
    );
    expect(screen.getByText(translations.no.editEvent)).toBeInTheDocument();
  });

  it('should call handleRegister when RegisterButton is clicked', () => {
    render(
      <EventCard
        event={event}
        user={user}
        handleRegister={mockHandleRegister}
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
      <EventCard
        event={event}
        user={registeredUser}
        handleUnregister={mockHandleUnregister}
        allowUnregister={true}
      />
    );
    fireEvent.click(screen.getByText(translations.no.unregister));
    expect(mockHandleUnregister).toHaveBeenCalledWith(event.id);
  });

  it('should call handleDelete when DeleteButton is clicked', () => {
    render(
      <EventCard
        event={event}
        user={user}
        handleDelete={mockHandleDelete}
      />
    );
    fireEvent.click(screen.getByText(translations.no.delete));
    expect(mockHandleDelete).toHaveBeenCalledWith(event.id);
  });

  it('should call handleEdit when EditButton is clicked', () => {
    render(
      <EventCard
        event={event}
        user={user}
        handleEdit={mockHandleEdit}
      />
    );
    fireEvent.click(screen.getByText(translations.no.editEvent));
    expect(mockHandleEdit).toHaveBeenCalledWith(event.id);
  });

});
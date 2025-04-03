import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import '@testing-library/jest-dom';
import EventList from './EventList';
import { useLanguage } from '../context/LanguageContext';
import translations from '../translations';



describe('EventList Component', () => {
  const mockEvents = [
    {
      id: '1',
      title: 'Test Event 1',
      description: 'This is a test event 1',
      location: 'Test Location 1',
      type: 'public',
      when: new Date().toISOString(),
      owner: 'user1',
      category: 'Test Category 1',
      isPrivate: false,
      attendees: ['user1', 'user2'],
    },
    {
      id: '2',
      title: 'Test Event 2',
      description: 'This is a test event 2',
      location: 'Test Location 2',
      type: 'public',
      when: new Date().toISOString(),
      owner: 'user2',
      category: 'Test Category 2',
      isPrivate: false,
      attendees: ['user3', 'user4'],
    },
  ];

  const mockUser = {
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

  it('should render the EventList component with title', () => {
    render(
      <EventList
        events={mockEvents}
        title="Test Title"
      />
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render a list of events', () => {
    render(
      <EventList
        events={mockEvents}
        title="Test Title"
      />
    );
    expect(screen.getByText('Test Event 1')).toBeInTheDocument();
    expect(screen.getByText('Test Event 2')).toBeInTheDocument();
  });

  it('should render a message when there are no events', () => {
    render(
      <EventList
        events={[]}
        title="Test Title"
      />
    );
    expect(screen.getByText(`${translations.no.nobody} test title.`)).toBeInTheDocument();
  });

});
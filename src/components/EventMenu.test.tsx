import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import '@testing-library/jest-dom';
import EventMenu from './EventMenu';
import { useLanguage } from '../context/LanguageContext';
import translations from '../translations';


describe('EventMenu Component', () => {
  const mockAttendees = ['user1', 'user2'];
  const mockId = '1';
  const mockOwner = 'owner1';
  const mockUid = 'user1';
  const mockIsPrivate = false;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the EventMenu component', () => {
    render(
      <EventMenu
        attendees={mockAttendees}
        id={mockId}
        owner={mockOwner}
        uid={mockUid}
        isPrivate={mockIsPrivate}
      />
    );
    expect(screen.getByRole('button', { name: '•••' })).toBeInTheDocument();
  });

  it('should open and close the menu', () => {
    render(
      <EventMenu
        attendees={mockAttendees}
        id={mockId}
        owner={mockOwner}
        uid={mockUid}
        isPrivate={mockIsPrivate}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: '•••' }));
    expect(screen.getByText(translations.no.showAttendees)).toBeInTheDocument();

  });

  it('should call handleViewAttendees when "Vis deltakere" is clicked', async () => {
    render(
      <EventMenu
        attendees={mockAttendees}
        id={mockId}
        owner={mockOwner}
        uid={mockUid}
        isPrivate={mockIsPrivate}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: '•••' }));
    fireEvent.click(screen.getByText(translations.no.showAttendees));
    await waitFor(() => {
      expect(screen.getByText('Deltakere')).toBeInTheDocument();
    });
  });

  it('should call handleViewComments when "Delta i samtalen" is clicked', async () => {
    render(
      <EventMenu
        attendees={mockAttendees}
        id={mockId}
        owner={mockOwner}
        uid={mockUid}
        isPrivate={mockIsPrivate}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: '•••' }));
    fireEvent.click(screen.getByText('Delta i samtalen'));
    await waitFor(() => {
      expect(screen.getByText('Kommentarer')).toBeInTheDocument();
    });
  });

  it('should call handleSendInvitation when "Send invitasjon" is clicked', async () => {
    window.prompt = jest.fn().mockReturnValue('test@example.com');
    render(
      <EventMenu
        attendees={mockAttendees}
        id={mockId}
        owner={mockOwner}
        uid={mockUid}
        isPrivate={mockIsPrivate}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: '•••' }));
    fireEvent.click(screen.getByText(translations.no.sendInvitation));
    await waitFor(() => {
      expect(window.prompt).toHaveBeenCalledWith('Enter the email of the user to invite:');
    });
  });
});
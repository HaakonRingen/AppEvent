"use client";
import { useState } from "react";

interface EventActions {
  anchorEl: HTMLElement | null;
  open: boolean;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleClose: () => void;
  handleSendInvitation: () => void;
  handleViewAttendees: (eventId: string) => Promise<void>;
}

const useEventActions = (): EventActions => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSendInvitation = () => {
    console.log("Sending invitation...");
    handleClose();
  };

  const handleViewAttendees = async (eventId: string) => {
    try {
      console.log(`Fetching attendees for event: ${eventId}`);
      // MÅ LEGGE TIL METODE FOR Å HENTE ATTENDEES

    } catch (error) {
      console.error("Error fetching attendees:", error);
    }
    handleClose();
  };

  return {
    anchorEl,
    open,
    handleClick,
    handleClose,
    handleSendInvitation,
    handleViewAttendees,
  };
};

export default useEventActions;

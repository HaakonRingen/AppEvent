'use client'
import React, { useState } from "react";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import translations from "../translations";
import { useLanguage } from "../context/LanguageContext";

// Attributtene EvenMenu har
interface EventMenuProps {
    attendees: string[];
    id: string;
    owner: string;
    uid: string;
    isPrivate: boolean;
}

const EventMenu: React.FC<EventMenuProps> = ({ attendees, id, owner, uid, isPrivate }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Hvor er menyen åpnet?
    const [openModal, setOpenModal] = useState(false); // Kontrollerer om modalen er åpen eller lukket
    const [modalContent, setModalContent] = useState<"attendees" | "comments" | "messages" | "invitation">("attendees"); // definerer hva modalen skal vise
    const [attendeeNames, setAttendeeNames] = useState<string[]>([]); // Lagrer navnene til deltakerne
    const [comments, setComments] = useState<{ user: string; comment: string }[]>([]); // Lagrer kommentarer
    const [newComment, setNewComment] = useState("");  // State for en ny kommentar
    const [messagesFromHosts, setMessagesFromHosts] = useState<{ user: string; message: string}[]>([]); // Lagrer meldinger fra arrangøren
    const [newMessageFromHost, setNewMessageFromHost] = useState(""); // State for en ny melding fra en arrangør
    const [invitationEmail, setInvitationEmail] = useState(""); // State for invitation email
    const open = Boolean(anchorEl); // Boolean for å sjekke om menyen er åpen
    const { language } = useLanguage(); // Henter valgt språk
    const t = translations[language]; // Henter oversettelse basert på språket
    const[showConfirmModal, setShowConfirmModal] = React.useState(false); // Bruker denne sånn at man kan få "er du sikker på at du vil sende denne meldingen" popup

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => { // Åpner menyen når knappen trykkes
        setAnchorEl(event.currentTarget);
    };

    // Method for inviting users to an event
    const handleSendInvitation = () => {
        setAnchorEl(null);
        setModalContent("invitation");
        setOpenModal(true);
    };

    const handleConfirmSendInvitation = async () => {
        if (!invitationEmail.trim()) return;

        try {
            const response = await fetch('/api/addInvitedUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId: id, email: invitationEmail }),
            });

            if (response.ok) {
                alert('User invited successfully');
                setInvitationEmail("");
                setOpenModal(false);
            } else {
                alert('Failed to invite user');
            }
        } catch (error) {
            console.error('Failed to invite user', error);
            alert('Failed to invite user');
        }
    };

    // Method to view attendees off an event
    const handleViewAttendees = async () => {
        setAnchorEl(null);
        try {
            const response = await fetch("/api/getNamesByID", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ attendees }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch attendee names");
            }

            const data = await response.json();
            setAttendeeNames(data.names);
        } catch (error) {
            console.error("Error fetching attendee names:", error);
            setAttendeeNames([]);
        }
        setModalContent("attendees");
        setOpenModal(true);
    };

    // Method to view comments on an event
    const handleViewComments = async () => {
        setAnchorEl(null);
        try {
            const response = await fetch("/api/getEventComments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId: id }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch comments");
            }

            const data = await response.json();
            setComments(data.comments);
        } catch (error) {
            console.error("Error fetching comments:", error);
            setComments([]);
        }
        setModalContent("comments");
        setOpenModal(true);
    };

    // Method to add a comment to an event
    const handleAddComment = async () => {
        if (!newComment.trim()) return; 

        try {
            const response = await fetch("/api/addComment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId: id, userId: uid, comment: newComment }),
            });

            if (!response.ok) {
                throw new Error("Failed to add comment");
            }

            // Refresh
            handleViewComments();
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleViewMessagesFromHost = async () => {
        setAnchorEl(null);
        try {
            const response = await fetch("/api/fetchMessages", { method: "GET" });
    
            if (!response.ok) {
                throw new Error("Failed to fetch messages");
            }
    
            const data = await response.json();

            console.log("Meldinger fra databasen før filtrering:", data.messages);
            console.log("Antall meldinger før filtrering:", data.messages.length);

            // Henter ut de messagesFromHost som er registrert på nåværende event
            const filteredMessages = data.messages.filter((msg: any) => {
                const eventIdFromEventWithPrefix = `${id}`; // Legger til /events/ til id for at eventid'en hentet fra eventet skal matche den fra messagesFromHost
                const eventIdFromMessage = msg.event;
                return eventIdFromMessage === eventIdFromEventWithPrefix;
            });

            console.log("Meldinger etter filtrering:", filteredMessages);
            console.log("Antall meldinger etter filtrering:", filteredMessages.length);

            setMessagesFromHosts(filteredMessages);
        } catch (error) {
            setMessagesFromHosts([]);
        }
        setModalContent("messages");
        setOpenModal(true);
    };
    
    // Method that registers a notification in the database
    const handleAddMessageFromHost = async () => {
        setAnchorEl(null);
        setModalContent("messages");
        setOpenModal(true);
        if (!newMessageFromHost.trim()) return;

        try {
            const response = await fetch("/api/addMessageFromHost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId: id, message: newMessageFromHost }),
            });

            if (!response.ok) {
                throw new Error("Failed to add message from host");
            }

            // Refresh
            handleViewMessagesFromHost();
            setNewMessageFromHost("");
            setOpenModal(false); // lukker modalen
        } catch (error) {
            console.error("Error adding message from host:", error);
            alert("Failed to send message");
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <div>
            <Button
                id="EventMenu"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                className="p-2 bg-blue-500 text-white rounded"
            >
                •••
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleViewAttendees}>{t.showAttendees}</MenuItem>
                <MenuItem onClick={handleViewComments}>{t.participateInConversation}</MenuItem>

                {/* Kan ikke invitere til et privat arrangement med mindre man er arrangør */}
                {
                    (!isPrivate || (isPrivate && owner === uid)) && (
                        <MenuItem onClick={handleSendInvitation}>{t.sendInvitation}</MenuItem>
                    )
                }
                {/* Kan ikke sende varslingsmelding med mindre man er arrangør */}
                {
                    (owner == uid) && (
                        <MenuItem onClick={handleViewMessagesFromHost}>{t.notifyAttendees}</MenuItem>
                    )
                }
            </Menu>

            {/* Bruke ulike popups avhengig av inneholdet i modalen = hvilke knapp en bruker trykker på */}

            {modalContent === "attendees" && (
                <Modal open={openModal} onClose={handleCloseModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4, }}>
                        <button onClick={handleCloseModal} style={{ position: 'absolute', top: 8, right: 12, fontSize: 20, cursor: 'pointer' }}>&times;</button>
                        <h2>{t.showAttendees}</h2>
                        <ul>
                            {attendeeNames.map((name, index) => <li key={index}>{name}</li>)}
                        </ul>
                    </Box>
                </Modal>
            )}

            {modalContent === "comments" && (
                <Modal open={openModal} onClose={handleCloseModal}>
                    <Box sx={{ 
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4, }}>
                        <button onClick={handleCloseModal} style={{ position: 'absolute', top: 8, right: 12, fontSize: 20, cursor: 'pointer' }}>&times;</button>
                        <h2>{t.participateInConversation}</h2>
                        <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={t.writeAComment} className="w-full p-2 border rounded mt-2" />
                        <button onClick={handleAddComment} className="mt-2 p-2 bg-blue-800 hover:bg-blue-900 text-white rounded">{t.addComment}</button>
                        <ul>
                            {comments.map((item, index) => (
                                <li key={index}><strong>{item.user}: </strong> {item.comment}</li>
                            ))}
                        </ul>
                    </Box>
                </Modal>
            )}

            {modalContent === "messages" && (
                <Modal open={openModal} onClose={handleCloseModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4, }}>
                        <button onClick={handleCloseModal} style={{ position: 'absolute', top: 8, right: 12, fontSize: 20, cursor: 'pointer' }}>&times;</button>
                        <h2>{t.sendNotificationHeader}</h2>
                        <input type="text" value={newMessageFromHost} onChange={(e) => setNewMessageFromHost(e.target.value)} placeholder={t.writeAMessage} className="w-full p-2 border rounded mt-2" />
                        <button onClick={() => setShowConfirmModal(true)} className="mt-2 p-2 bg-blue-500 text-white rounded" > Send </button>
                        <h2>{t.previouslySentNotifications}</h2>
                            {messagesFromHosts.length === 0 ? (
                                <p>{t.noPreviousNotifications}</p>
                            ) : (
                                <ul>
                                    {messagesFromHosts.map((msg, index) => (
                                        <li key={index}>{msg.message}</li>
                                    ))}
                                </ul>
                            )}
                    </Box>
                </Modal>    
            )}

            {modalContent === "invitation" && (
                <Modal open={openModal} onClose={handleCloseModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4, }}>
                        <button onClick={handleCloseModal} style={{ position: 'absolute', top: 8, right: 12, fontSize: 20, cursor: 'pointer' }}>&times;</button>
                        <h2>{t.sendInvitation}</h2>
                        <input 
                            type="email" 
                            value={invitationEmail} 
                            onChange={(e) => setInvitationEmail(e.target.value)} 
                            placeholder="Skriv e-postadressen ..." 
                            className="w-full p-2 border rounded mt-2" 
                        />
                        <button 
                            onClick={handleConfirmSendInvitation} 
                            className="mt-2 p-2 bg-blue-800 hover:bg-blue-900 text-white rounded"
                            >
                                {t.sendInvitation}
                        </button>
                    </Box>
                </Modal>
            )}

            {modalContent === "invitation" && (
                <Modal open={openModal} onClose={handleCloseModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4, }}>
                        <button onClick={handleCloseModal} style={{ position: 'absolute', top: 8, right: 12, fontSize: 20, cursor: 'pointer' }}>&times;</button>
                        <h2>{t.sendInvitation}</h2>
                        <input 
                            type="email" 
                            value={invitationEmail} 
                            onChange={(e) => setInvitationEmail(e.target.value)} 
                            placeholder= {t.writeEmail}
                            className="w-full p-2 border rounded mt-2" 
                        />
                        <button 
                            onClick={handleConfirmSendInvitation} 
                            className="mt-2 p-2 bg-blue-800 hover:bg-blue-900 text-white rounded"
                            >
                                {t.sendInvitation}
                        </button>
                    </Box>
                </Modal>
            )}

            {/* Bekreftelsesmodal */}
            <Modal open={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4, 
                }}>
            <h2>{t.sureYouWannaSendNotification}</h2>
            <p>{newMessageFromHost}</p>
            <div className="flex justify-between mt-4">
                <button 
                    onClick={() => {
                        handleAddMessageFromHost();
                        setShowConfirmModal(false);
                        setOpenModal(false);
                    }} 
                    className="p-2 bg-green-500 text-white rounded"
                >
                    Send
                </button>
                <button 
                    onClick={() => setShowConfirmModal(false)} 
                    className="p-2 bg-red-500 text-white rounded"
                >
                    {t.abortSending}
                </button>
                </div>
                </Box>
            </Modal>
        </div>
    );
};

export default EventMenu;

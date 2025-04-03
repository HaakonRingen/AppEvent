import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import translations from '../translations';

interface MessageType {
  id: string;
  event: string;
  message: string;
  eventTitle?: string;
}

interface MessageListProps {
  messages: MessageType[];
  noMessagesText: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, noMessagesText }) => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">{t.messages}</h2>
      {messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="p-4 border rounded shadow-sm bg-white max-w-xs">
              <p className="font-semibold">{t.event}: {message.eventTitle}</p>
              <p>{t.message}: {message.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">{noMessagesText}</p>
      )}
    </div>
  );
};

export default MessageList;
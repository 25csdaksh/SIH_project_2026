import React from 'react';
import { Bot, User } from 'lucide-react';
import '../styles/chatbot.css';

export const ChatMessage = ({ message }) => {
  const { sender, text } = message;
  const isBot = sender === 'bot';

  return (
    <div className={`chat-message-row ${isBot ? 'bot-row' : 'user-row'}`}>
      <div className={`avatar-icon ${isBot ? 'bot-avatar' : 'user-avatar'}`}>
        {isBot ? <Bot size={18} /> : <User size={18} />}
      </div>
      <div className={`message-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`}>
        <p>{text}</p>
      </div>
    </div>
  );
};

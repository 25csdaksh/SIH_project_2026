import React, { useState } from 'react';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { Loader } from '../../../components/common/Loader';
import { chatbotApi } from '../services/chatbotApi';
import { useLanguage } from '../../../hooks/useLanguage';
import '../styles/chatbot.css';

export const ChatbotPage = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am KrishiSeva AI Assistant. How can I help you with your crops, soil, pests, or farming today?'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (text) => {
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);
    try {
      const res = await chatbotApi.sendMessage(text, language);
      const botMsg = { id: Date.now() + 1, sender: 'bot', text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Sorry, I encountered an issue. Please ask your farming question again.'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-page-container">
      <div>
        <h1>{t('chatbot.title')}</h1>
        <p>{t('chatbot.subtitle')}</p>
      </div>

      <div className="chat-window-card">
        <div className="chat-messages-container">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}
          {loading && <Loader message="KrishiSeva AI is thinking..." />}
        </div>
        <ChatInput onSend={handleSendMessage} loading={loading} />
      </div>
    </div>
  );
};

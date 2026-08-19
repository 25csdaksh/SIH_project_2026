import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { useLanguage } from '../../../hooks/useLanguage';
import '../styles/chatbot.css';

export const ChatInput = ({ onSend, loading }) => {
  const { t } = useLanguage();
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !loading) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <input
        type="text"
        className="chat-input"
        placeholder={t('chatbot.inputPlaceholder')}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />
      <Button type="submit" variant="primary" loading={loading} disabled={!text.trim()}>
        <Send size={18} /> {t('chatbot.send')}
      </Button>
    </form>
  );
};

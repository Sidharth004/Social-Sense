// App.jsx
import { useState, useCallback } from 'react';
import Header from './components/Header';
import Modal from './components/Modal';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';
import { langflowClient } from "./service/langflowClient";
import './App.css';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [showModal, setShowModal] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSendMessage = useCallback(async (message) => {
        try {
            setError(null);
            setIsLoading(true);
            
            // Add user message immediately
            setMessages(prev => [...prev, { 
                type: 'user', 
                content: message 
            }]);

            const response = await langflowClient.sendChatMessage(message);
            
            if (response?.message) {
                setMessages(prev => [...prev, {
                    type: 'system',
                    content: response.message
                }]);
            } else {
                throw new Error('Invalid response format from server');
            }

        } catch (error) {
            console.error('Chat Error:', error);
            setError(error.message);
            setMessages(prev => [...prev, {
                type: 'error',
                content: 'Sorry, there was an error processing your request.'
            }]);
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array since we're not using any external values

    return (
        <div className="chat-container">
            <Header />
            <div className="messages-container">
                {messages.map((message, index) => (
                    <ChatMessage
                        key={`${message.type}-${index}`}
                        type={message.type}
                        content={message.content}
                    />
                ))}
                {isLoading && (
                    <div className="loading-message">
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
            </div>
            {error && (
                <div className="error-banner">
                    {error}
                </div>
            )}
            <InputArea 
                onSendMessage={handleSendMessage} 
                isLoading={isLoading} 
            />
            {showModal && <Modal onClose={() => setShowModal(false)} />}
        </div>
    );
}
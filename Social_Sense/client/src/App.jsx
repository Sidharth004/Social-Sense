import { useState, useEffect } from 'react';
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

    // Load messages from localStorage when component mounts
    useEffect(() => {
        try {
            const savedMessages = localStorage.getItem('chatMessages');
            if (savedMessages) {
                setMessages(JSON.parse(savedMessages));
            }
        } catch (error) {
            console.error('Error loading messages from localStorage:', error);
        }
    }, []);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('chatMessages', JSON.stringify(messages));
        }
    }, [messages]);

    const handleClearChat = () => {
        setMessages([]);
        localStorage.removeItem('chatMessages');
    };

    const handleSendMessage = async (message) => {
        try {
            setError(null);
            setIsLoading(true);
            
            // Add user message
            setMessages(prev => [...prev, { 
                type: 'user', 
                content: message 
            }]);

            const response = await langflowClient.sendChatMessage(message);
            console.log('Response from langflowClient:', response);

            if (response?.message?.text) {
                setMessages(prev => [...prev, {
                    type: 'system',
                    content: response.message.text
                }]);
            } else {
                throw new Error('Invalid response format');
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
    };

    return (
        <div className="chat-container">
            <Header />
            <div className="chat-controls">
                <button 
                    onClick={handleClearChat}
                    className="clear-chat-btn"
                    disabled={messages.length === 0}
                >
                    Clear Chat
                </button>
            </div>
            <div className="messages-container">
                {messages.map((message, index) => (
                    <ChatMessage
                        key={`msg-${index}`}
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

import { useState } from "react";
import StatsModal from './StatsModal';
import './InputArea.css'

export default function InputArea({onSendMessage,isLoading,onClearChat}){
    const [input,setInput] = useState('');
    const [showStats, setShowStats] = useState(false);

    const handleSubmit =(e)=>{
        e.preventDefault()
        if(input.trim() && !isLoading){
            onSendMessage(input)
            setInput('')
        }
    }

    return(
        <form onSubmit={handleSubmit} className="input-area">
            <div className="input-container">
                <div className="message-group">
                    <input
                        type="text" 
                        value={input}
                        onChange={(e)=>setInput(e.target.value)}
                        placeholder="Ask about your social media performance..."
                        className="message-input"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit"
                        className={`send-button ${isLoading?'disabled':''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </div>
                
                <div className="action-buttons">
                    <button 
                        onClick={() => setShowStats(true)}
                        className="stats-button"
                        type="button"
                    >
                        Compare Stats
                    </button>
                    <button 
                        onClick={onClearChat}
                        className="clear-chat-button"
                        type="button"
                    >
                        Clear Chat
                    </button>
                </div>
            </div>
            <StatsModal 
                isOpen={showStats} 
                onClose={() => setShowStats(false)} 
            />
        </form>
)}

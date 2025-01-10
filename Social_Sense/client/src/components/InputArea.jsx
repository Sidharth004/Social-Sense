import { useState } from "react";
import './InputArea.css'

export default function InputArea({onSendMessage,isLoading,onClearChat}){
    const [input,setInput] = useState('');

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
            <input
                type="text" 
                value={input}
                onChange={(e)=>setInput(e.target.value)}
                placeholder="Ask about your social media performance..."
                className="message-input"
                disabled={isLoading}
            >
            
            </input>
            <button 
                type="submit"
                className={`send-button ${isLoading?'disabled':''}`}
                disabled={isLoading}
            >
                {isLoading ? 'Sending...' : 'Send'}
            </button>
            <button 
                onClick={onClearChat}
                className="clear-chat-button"
            >
                Clear Chat
            </button>

            </div>
        </form>
    )}

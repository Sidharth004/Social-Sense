
export default function ChatMessage({type,content}){
    return(
        <div className={`chat-message ${type}`}>
            <div className="message-content">
                {type==='system' && (
                    <div className="system-header">
                        {/* header logo */}
                        <div className="system-logo">🤖</div>
                        <span className="system-name">SocialSense</span>

                    </div>
                )}
                { type ==='user'&&(
                    <div className='user-header'>
                        <div className='user-logo'>☃️</div>
                        <span className="user-name">You</span>

                    </div>
                )}
                <div 
                    className='message-text'
                    dangerouslySetInnerHTML={{
                        __html:type==='system'
                        ? formatAIResponse(content)
                        :content
                    }}>

                </div>
               
            </div>
        </div>
    )
}
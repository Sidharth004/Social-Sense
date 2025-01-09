import './Header.css'

export default function Header(){
    return(
        <header className="header">
            <div className="header-content">
                <div className="avatar-container">
                    {/* image */}
                    {/* <div className="status-indicator"></div> */}
                </div>
            
                <div className="chatbot-info">
                    <h1 className="chatbot-name">SocialSense</h1>
                    <p className="chatbot-description">Your social media analytics assistant</p>
                </div>
            </div>
            <span className="status-badge">Active</span>
        </header>
    )
}
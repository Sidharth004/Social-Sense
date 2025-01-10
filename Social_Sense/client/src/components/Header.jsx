import './Header.css'

export default function Header(){
    return(
        <header className="header">
            <div className="header-content">
                <div className="title-container">
                    <h1 className="chatbot-name">🤖 SocialSense</h1>
                    <p className="chatbot-description">Your social media analytics assistant</p>
                </div>
            </div>
            <div className="header-actions">
                <a 
                    href="https://youtu.be/4m2VtXyETM0" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="demo-link"
                >
                    Check Demo
                </a>
                <a 
                    href="https://github.com/Sidharth004/Social-Sense" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="demo-link"
                >
                    <i className="fab fa-github"></i> GitHub
                </a>
                <div className="status-badge">
                  😊 Systems Active 
                </div>
            </div>
        </header>
    )
}
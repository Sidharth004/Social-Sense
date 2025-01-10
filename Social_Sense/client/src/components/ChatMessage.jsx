import './ChatMessage.css';

export function formatAIResponse(content) {
    if (!content) return '';

    try {
        // If content is a JSON string, parse it
        if (typeof content === 'string' && content.trim().startsWith('{')) {
            const parsedContent = JSON.parse(content);
            content = parsedContent.text || content;
        }

        let formatted = content.replace(/\n{3,}/g, '\n\n');
        
        // Format numbers with commas
        formatted = formatted.replace(/(\d{1,3}(,\d{3})*(\.\d+)?)/g, 
            '<span class="number">$1</span>');
        
        // Convert platform names to bold
        formatted = formatted.replace(
            /(Facebook|Instagram|Twitter)/g, 
            '<strong>$1</strong>'
        );

        // Format statistics
        formatted = formatted.replace(
            /(\d[\d,.]*(?: likes| shares| comments| impressions| followers))/g,
            '<span class="stat">$1</span>'
        );

        // Split by paragraphs and wrap appropriately
        const paragraphs = formatted.split('\n').map(para => {
            para = para.trim();
            if (!para) return '<br/>';
            if (para.includes('class="')) return para;
            return `<p>${para}</p>`;
        }).join('');

        return paragraphs;
    } catch (error) {
        console.error('Error formatting message:', error);
        return content;
    }
}

export default function ChatMessage({type, content}) {
    console.log('Rendering message:', { type, content });

    const formatContent = (content) => {
        if (typeof content === 'string') {
            return type === 'system' ? 
                <div dangerouslySetInnerHTML={{ __html: formatAIResponse(content) }} /> 
                : content;
        }
        if (content && typeof content === 'object') {
            return JSON.stringify(content, null, 2);
        }
        return 'No content available';
    };

    return (
        <div className={`chat-message ${type}`}>
            <div className="message-content">
                {type === 'system' && (
                    <div className="system-header">
                        <div className="system-logo">🤖</div>
                        <span className="system-name">SocialSense</span>
                    </div>
                )}
                {type === 'user' && (
                    <div className='user-header'>
                        <div className='user-logo'>☃️</div>
                        <span className="user-name">You</span>
                    </div>
                )}
                <div className="message-text">
                    {formatContent(content)}
                </div>
            </div>
        </div>
    );
}
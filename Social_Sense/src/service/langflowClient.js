// langflowClient.js
import { config } from '../config';

class LangflowClient {
    constructor() {
        this.baseURL = config.apiBaseUrl;
    }

    async sendChatMessage(message) {
        try {
            console.log('Sending chat message:', message);
            
            const response = await fetch(`${this.baseURL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Server response:', data);
            
            if (!data.message) {
                throw new Error('Invalid response format');
            }

            return {
                message: {
                    text: data.message
                }
            };
        } catch (error) {
            console.error('Chat Error:', error);
            throw error;
        }
    }
}

export const langflowClient = new LangflowClient();
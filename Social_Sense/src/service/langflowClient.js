export class LangflowClient {
    constructor(baseURL, applicationToken) {
        this.baseURL = 'https://cors-anywhere.herokuapp.com/'+baseURL;
        this.applicationToken = import.meta.env.LANGFLOW_API_TOKEN;
        this.flowId = '0d7e3447-8e3e-410d-a105-82a3950a9a63';
        this.langflowId = 'd0b69b93-fe82-45e5-b120-83960c461ab3';
    }

    async post(endpoint, body) {
        const headers = {
            "Authorization": `Bearer ${this.applicationToken}`,
            "Content-Type": "application/json"
        };

        const url = `${this.baseURL}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

            
            if (!response.ok) {
                throw new Error(`${response.status} `);
            }
            
            try{
                const responseMessage = await response.json();
                return responseMessage;
            }catch(parseError){
                console.error('JSON PARSE ERRPR',parseError);
                const text= await response.text();
                console.log('response text', text)

            }

            return responseMessage;
        } catch (error) {
            console.error('Request Error:', error.message);
            throw error;
        }
    }

    async sendChatMessage(message) {
        const endpoint = `/lf/${this.langflowId}/api/v1/run/${this.flowId}`;
        const tweaks = {
            "ChatInput-z0i8A": {},
            "ParseData-lNc9b": {},
            "Prompt-gra52": {},
            "SplitText-tJddc": {},
            "ChatOutput-RMZRT": {},
            "AstraDB-adZgd": {},
            "AstraDB-nweIA": {},
            "File-TWw0o": {},
            "HuggingFaceInferenceAPIEmbeddings-Q7K36": {},
            "HuggingFaceInferenceAPIEmbeddings-Jpga9": {},
            "GroqModel-dOq5O": {}
        };

        const body = {
            input_value: message,
            input_type: 'chat',
            output_type: 'chat',
            tweaks
        };

        const response = await this.post(endpoint, body);
        
        if (response && response.outputs) {
            const flowOutputs = response.outputs[0];
            const firstComponentOutputs = flowOutputs.outputs[0];
            return firstComponentOutputs.outputs.message;
        }
        
        throw new Error('Invalid response format');
    }
}

// Create and export a singleton instance
export const langflowClient = new LangflowClient(
    'https://api.langflow.astra.datastax.com'
    // 'LANGFLOW_API_TOKEN' // Replace with your token
);
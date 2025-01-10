from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json
from langflow_api.client import LangflowClient

# Load environment variables
load_dotenv()

ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Development
    "https://animated-basbousa-4190ed.netlify.app",  # Netlify domain
]

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ALLOWED_ORIGINS,
        "methods": ["POST", "OPTIONS", "GET"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
# Initialize Langflow client
client = LangflowClient(
    base_url="https://api.langflow.astra.datastax.com",
    langflow_id="d0b69b93-fe82-45e5-b120-83960c461ab3",
    flow_id="0d7e3447-8e3e-410d-a105-82a3950a9a63",
    application_token=os.getenv("VITE_LANGFLOW_API_TOKEN")
)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message')
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400

        print(f"Received message: {message}")
        
        # Call Langflow API
        response = client.run_flow(message=message)
        print(f"Langflow response: {json.dumps(response, indent=2)}")
        
        # Try different paths to extract the message
        ai_message = None
        try:
            # First attempt: normal path
            ai_message = response.get('outputs', [])[0].get('outputs', [])[0].get('artifacts', {}).get('message')
            
            # Second attempt: direct text path
            if not ai_message:
                ai_message = response.get('outputs', [])[0].get('outputs', [])[0].get('text')
            
            # Third attempt: nested message path
            if not ai_message:
                ai_message = response.get('outputs', [])[0].get('outputs', [])[0].get('outputs', {}).get('message', {}).get('text')
        
        except (IndexError, AttributeError, TypeError) as e:
            print(f"Error extracting message: {e}")
            print(f"Response structure: {json.dumps(response, indent=2)}")
        
        if not ai_message:
            return jsonify({'error': 'Could not extract response message'}), 500

        return jsonify({'message': ai_message})

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     print("Starting Flask server...")
#     app.run(port=3000, debug=True)
#     #port = int(os.environ.get('PORT', 3000))
#     #app.run(host='0.0.0.0', port=port)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    if os.environ.get('FLASK_ENV') == 'production':
        app.run(host='0.0.0.0', port=port)
    else:
        app.run(port=port, debug=True)
import requests
from typing import Optional, Dict, Any

class LangflowClient:
    def __init__(self, base_url: str, langflow_id: str, flow_id: str, application_token: str):
        self.base_url = base_url
        self.langflow_id = langflow_id
        self.flow_id = flow_id
        self.application_token = application_token

    def run_flow(self, 
                message: str,
                input_type: str = "chat",
                output_type: str = "chat",
                tweaks: Optional[Dict[str, Any]] = None) -> dict:
        """
        Run a flow with the given message and optional tweaks.
        """
        api_url = f"{self.base_url}/lf/{self.langflow_id}/api/v1/run/{self.flow_id}"
        
        # Simplified tweaks to avoid Astra DB error
        payload = {
            "input_value": message,
            "input_type": input_type,
            "output_type": output_type,
            "tweaks": {
                "ChatInput-z0i8A": {},
                "Prompt-gra52": {},
                "GroqModel-dOq5O": {}
            }
        }

        headers = {
            "Authorization": f"Bearer {self.application_token}",
            "Content-Type": "application/json"
        }

        try:
            print(f"Making request to: {api_url}")
            print(f"With payload: {payload}")
            response = requests.post(api_url, json=payload, headers=headers)
            print(f"Response status: {response.status_code}")
            print(f"Response content: {response.text}")
            
            # Handle non-200 responses
            if response.status_code != 200:
                error_data = response.json()
                print(f"Error data: {error_data}")
                if "detail" in error_data:
                    raise Exception(f"Langflow API error: {error_data['detail']}")
                raise Exception(f"Langflow API error: Status {response.status_code}")
                
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Error calling Langflow API: {str(e)}")
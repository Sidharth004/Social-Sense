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
        
        payload = {
            "input_value": message,
            "input_type": input_type,
            "output_type": output_type,
            "tweaks": tweaks or {
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
            response.raise_for_status()  # Raise exception for bad status codes
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Error calling Langflow API: {str(e)}")
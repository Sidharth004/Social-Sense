import { useState } from 'react'
import Header from './components/Header';
import Modal from './components/Modal'
import ChatMessage from './components/ChatMessage'
import InputArea from './components/InputArea'
import { langflowClient} from "./service/langflowClient";
import './App.css'

export default function Chat(){
  const [messages,setMessages]= useState([]);
  const [showModal,setShowModal] = useState(true);
  const [isLoading, setIsLoading] =useState(false);
  const [error,setError] = useState(null);

  const handleSendMessage = async (message) =>{
    try{
      setError(null);
      setMessages([...messages,{type:'user', content: message}])
      setIsLoading(true)

      //AI response
      const response = await langflowClient.sendChatMessage(message);
      setMessages(prev=>[...prev,{type:'system',content:response.message.text}])
      console.log('AI RESPONSE:  '+response.text);
      
      //simulated API call delay
      // await new Promise(resolve =>setTimeout(resolve,1000) )
      // setMessages(prev=>[...prev,{type:'system', content: 'This is a simulated AI response.'}]);
    

    //   setTimeout(()=>{
    //     setMessages(prev=>[...prev,{type:'system', content: 'This is a simulated AI response.'}],1000)
    //   })
    // }
    
    }catch(error){
      setMessages(prev=>[...prev,{
        type:'error',
        content:'...'
      }])
    }finally{
      setIsLoading(false)
    }
  }
  return(
    <div className="chat-container">
      <Header />
      <div className="messages-container">
        {messages.map((message,index)=>{
          return <ChatMessage 
            key={index} 
            type={message.type} 
            content={message.content}
            />
        })}
      
      {isLoading && (
        <div className="loading-message">
          <div className="typing-indicater">
            <span></span>
            <span></span>
          </div>
        </div>
    
      )}
    </div>
    {error && (
                <div className="error-banner">
                    {error}
                </div>
    )}

    <InputArea onSendMessage={handleSendMessage} isLoading={isLoading}/>
    {showModal && <Modal onClose={()=>setShowModal(false)}/>}
    </div>
  )
}


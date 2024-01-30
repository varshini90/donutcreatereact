import React, { useState } from 'react';
import { ReactTyped } from "react-typed";
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

interface Message {
  author: 'user' | 'bot';
  content: string;
}

interface QueryRequest {
    query: string;
    history: string
}

interface QueryType {
    query: string;
    response: string
}

export interface Analysis {
  message: string,
  score: number
}

interface ChildProps {
  onScoreGenerated: (analysis: Analysis) => void; // Function type prop
}

const ChatBot: React.FC<ChildProps>= (props: ChildProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const mainContext = 'You are a helpful assistant designed to output JSON.You are a helpful assistant designed to help understand credit score systems and provide probable credit score after asking user these 5 questions 1. Annual Income 2. Resding Country 3. Existing Credit Score 4. Existing Loans, 5. Highest education level. Analyse and give a probable credit score based on the region user belongs to. Give a analysis on why the credit score is impacted';
  const [inputText, setInputText] = useState('');
  const oldHistory: any = localStorage.getItem('queryHistory')  !== null ? localStorage.getItem('queryHistory') : [];
  // Apply typewriter effect to the current bot message

  const sendMessage = async (text: string) => {
    const userMessage: Message = { author: 'user', content: text };
    const msgs = messages;
    msgs.push(userMessage);
    setMessages(msgs); 
           try {
        const localHistory: any = localStorage.getItem('queryHistory');
        const historyArray:any[] = localHistory !== null ? JSON.parse(localHistory) : []; 
        const h = historyArray.map((value: any) => {return value.content});
        h.unshift(mainContext);
        const tecxt = h.join('.');
        const request: QueryRequest = {
            query: inputText,
            history: tecxt
          };  
      const response = await axios.post('/api/chatbot', { query: inputText, history: tecxt});
      const botMessage: Message = { author: 'bot', content: response.data.message };
      msgs.push(botMessage);
      setMessages(msgs);

      if(response.data.score){
        props.onScoreGenerated({message: response.data.message, score: response.data.score});
      }
        // Optionally, you can set intermediate responses here if needed
       // reader.read().then(processText);
        localStorage.setItem('queryHistory', JSON.stringify(messages));

        console.log(messages);
  
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setInputText(''); // Clear input after sending
  };

  // Handle user input submission
  const handleInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('handleInputSubmit');
    if (e.key === 'Enter' && inputText.trim()) {
      sendMessage(inputText.trim());
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.author}`}>
           {msg.author === 'bot' && (<Avatar>
                                    <SmartToyIcon />
                                    </Avatar>)} 

                                    {msg.author !== 'bot' && (<Avatar>
                                    <PersonIcon />
                                    </Avatar>)} 
           
            {/* <div className={msg.author === 'bot' ? 'bot': 'user'}>
              {msg.content}
            </div> */}
      <div className={msg.author === 'bot' ? 'bot': 'user'}>
      <ReactTyped strings = {[msg.content]}typeSpeed={40}/>
      </div>
            
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleInputSubmit}
        />
        <button onClick={() => sendMessage(inputText)}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;

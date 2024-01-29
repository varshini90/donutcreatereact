import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useTypewriter from './useTypeWriter'; // Assuming useTypewriter hook is defined as before
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

const ChatbotOls: React.FC = () => {
    const mainContext = 'You are a helpful assistant designed to help understand credit score systems. For the given prompts, ask user next set of questions till it is good to analyse credit score based on parameters like annual income, existing loans, country, age ..etc. Gather credit scoring distribution range for each country that has data vavailable publicly, based on the input given by user generate a probable credit score';
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [botIsTyping, setBotIsTyping] = useState(false);
  const [currentBotMessage, setCurrentBotMessage] = useState('');

  // Apply typewriter effect to the current bot message
  const typedBotMessage = useTypewriter(currentBotMessage);

  useEffect(() => {
    // If the last message is from the bot and botIsTyping is true, set it as the current message for the typewriter effect
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.author === 'bot' && botIsTyping) {
      setCurrentBotMessage(lastMessage.content);
    }
  }, [messages, botIsTyping]);

  // Function to handle sending of messages and receiving streamed responses
  const sendMessage = async (text: string) => {
    // Add user message
    const localHistory: any = localStorage.getItem('queryHistory');
    const historyArray:any[] = localHistory !== null ? JSON.parse(localHistory) : [];
    historyArray.unshift(mainContext);
    const request: QueryRequest = {
        query: inputText,
        history: historyArray.join('.')
      };

    setMessages((msgs) => [...msgs, { author: 'user', content: text }]);
    setInputText('');

    try {
      // Simulate streaming response by breaking the response into chunks
      const simulatedStreamedResponse = 'This is a simulated streaming response...';
      setBotIsTyping(true);

      for (let i = 0; i < simulatedStreamedResponse.length; i++) {
        setTimeout(() => {
          setCurrentBotMessage(simulatedStreamedResponse.slice(0, i + 1));
          if (i === simulatedStreamedResponse.length - 1) {
            setBotIsTyping(false);
            setMessages((msgs) => [...msgs, { author: 'bot', content: simulatedStreamedResponse }]);
          }
        }, 100 * i);
      }
    } catch (error) {
      console.error('Error sending message:', error);
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
            <div className="text">{msg.author === 'bot' ? (botIsTyping ? typedBotMessage : msg.content) : msg.content}</div>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputText)}
        />
        <button onClick={() => sendMessage(inputText)}>Send</button>
      </div>
    </div>
  );
};

export default ChatbotOls;

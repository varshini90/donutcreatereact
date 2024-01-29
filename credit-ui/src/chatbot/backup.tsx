import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { Grid, IconButton } from '@mui/material';
import Stack from '@mui/material/Stack';
import axios from 'axios';


interface Message {
    author: 'user' | 'bot';
    content: string;
  }

interface QueryType {
    query: string;
    response: string
}

interface QueryRequest {
    query: string;
    history: string
}

const Backup: React.FC = () => {
    const mainContext = 'You are a helpful assistant designed to help understand credit score systems. For the given prompts, ask user next set of questions till it is good to analyse credit score based on parameters like annual income, existing loans, country, age ..etc. Gather credit scoring distribution range for each country that has data vavailable publicly, based on the input given by user generate a probable credit score';
    const [query, setQuery] = React.useState('');
    const [queries, setQueries] = React.useState<QueryType>();
    const [messages, setMessages] = useState<string[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [responses, setResponses] = useState<any[]>([]);
    const [error, setError] = useState('');

   // const lastBotMessage = messages.filter((msg) => msg.author === 'bot').pop()?.content || '';
    //const typedMessage = useTypewriter(lastBotMessage);


    // useEffect(() => {
    //     if (lastBotMessage && lastBotMessage !== typedMessage) {
    //       setIsTyping(true);
    //     } else {
    //       setIsTyping(false);
    //     }
    //   }, [lastBotMessage, typedMessage]);

      useEffect(() => {
        // This function is responsible for reading the streamed response
        const readStream = async (response: any) => {
          const reader = response.data.getReader();
          const decoder = new TextDecoder();
    
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value);
              try {
                const json = JSON.parse(chunk);
                setResponses((prev) => [...prev, json.choices[0].text]);
              } catch (err) {
                console.error('Error parsing JSON chunk', err);
              }
            }
          } catch (err) {
            setError('Error reading stream');
            console.error('Stream reading failed', err);
          }
        };
    });
    

      const handleSendMessage = async () => {
        const localHistory: any = localStorage.getItem('queryHistory');
        const historyArray:any[] = localHistory !== null ? JSON.parse(localHistory) : [];
        historyArray.unshift(mainContext);
        const request: QueryRequest = {
            query: inputText,
            history: historyArray.join('.')
          };
        // const userMessage: Message = { author: 'user', content: inputText };
        // setMessages((msgs: string[]) => [...msgs, userMessage]);
    
        try {
          const response = await axios({
            method: 'POST',
            url: 'https://localhost:8000/chatbot/',
            responseType: 'stream',
            data: {request}
          });

          
        const reader = response.data.getReader();
        let decoder = new TextDecoder();

        reader.read().then(function processText( done: boolean, value: any ) {
          if (done) {
            console.log('Stream complete');
            return;
          }

          // Convert the Uint8Array to a string and process the chunk
          const chunk = decoder.decode(value, { stream: true });
          console.log('Chunk Received: ', chunk);
          setMessages(prevMessages => [...prevMessages, chunk]);

          // Read the next chunk
          return reader.read().then(processText);
        });
          
         
          
          
          
        //   axios.post('https://localhost:8000/chatbot/', { request});
        //   const botMessage: Message = { author: 'bot', content: response.data.message };
        //   setMessages((msgs:string[]) => [...msgs, botMessage]);
        } catch (error) {
          console.error('Error sending message:', error);
        }
    
        setInputText('');
      };


 const submitQuery = (query: string) => {
    const localHistory: any = localStorage.getItem('queryHistory');
    const historyArray:any[] = localHistory !== null ? JSON.parse(localHistory) : [];
    historyArray.unshift(mainContext);

    const request: QueryRequest = {
        query: query,
        history: historyArray.join('.')
      };

      axios.post(`https://localhost:8000/chatbot/`, { request })
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
   

 }

    return ( <React.Fragment>
       {/* <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.author}`}>
            <img src={msg.author === 'bot' ? 'bot-avatar.png' : 'user-avatar.png'} alt={msg.author} className="avatar" />
            <div className="text">{msg.author === 'bot' && isTyping ? typedMessage : msg.content}</div>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div> */}
        
      </React.Fragment>)
};

export default Backup;
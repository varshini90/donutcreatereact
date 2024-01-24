import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { IconButton } from '@mui/material';
import Stack from '@mui/material/Stack';

const ChatBot: React.FC = () => {

    const [query, setQuery] = React.useState('');
    const [queries, setQueries] = React.useState<string[]>([]);



 const updateQueries  = () => {
   let arr: any[] = [...queries];
   arr.push(query);
   setQueries(arr);
   setQuery('');
 }

    return ( <React.Fragment>
        <CssBaseline />
        <Typography variant="h6">Chatbot</Typography>
        
       
          <Box sx={{
        border: 1,                // Sets the border width
        borderColor: 'primary.main', // Use the primary color from the theme
        borderRadius: 2,          // Sets the border radius
        padding: 2,               // Sets the padding inside the box
        margin: 2,                // Sets the margin outside the box
        width: 'inherit',           // Sets the width of the box
        height: '500px'           // Sets the height of the box
      }}>

        <Stack direction="column" alignItems="center" spacing={1}>
        <Box className='displayResult' sx={{width: 'inherit', height: '400px' }}>
            {queries.map((row: any, i: number) => (
                 <Stack direction="column" alignItems="center" spacing={1} key={i}>
                    <div>{row}</div>
                 </Stack>
                
            ))}

        
        </Box>
            
        <div className='sendQuery'>
        <TextField id="outlined-basic" label="Outlined" variant="outlined" type ="text" value={query} onChange={(e) => {setQuery(e.target.value)}}/>
        <IconButton aria-label="send" size="large" onClick={updateQueries}>
        <SendRoundedIcon />
      </IconButton>
        </div>
            </Stack>
          </Box>
      </React.Fragment>)
};

export default ChatBot;
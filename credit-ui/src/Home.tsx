import React from 'react';
import { AppBar, Toolbar, Typography, Grid } from '@mui/material';
import D3Chart from './charts/D3Chart';
import { Divider } from '@mui/material';
import { DonutBarplotTransition } from './charts/DonutBarPlotTransition';
import ChatBot from './chatbot/ChatBot';

const Home: React.FC = () => {
    // Sample data for D3 chart
    const creditScoreData = [
      { name: 'Excellent', value: 50 },
      { name: 'Good', value: 30 },
      { name: 'Fair', value: 10 },
      { name: 'Poor', value: 5 },
      { name: 'Bad', value: 5 }
    ];
  

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Grid container spacing={2} style={{ marginTop: '20px', padding: '20px' }}>
                <Grid item xs={12} md={3}>
                    <ChatBot></ChatBot>
                    
                </Grid>
               
                <Grid item xs={12} md={9}>
                    <Typography variant="h6">Graphs</Typography>
                    {/* <CreditScoreDonutChart data={creditScoreData}></CreditScoreDonutChart> */}
                    <DonutBarplotTransition width={500} height={500} />
                </Grid>
            </Grid>
        </div>
    );
};

export default Home;

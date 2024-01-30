import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Grid } from '@mui/material';
import axios from 'axios';
import ChatBot from './chatbot/ChatBot';
import { Analysis } from './chatbot/ChatBot';
import DonutChart, {ScoreItem,DonutChartProps} from './charts/DonutChart';
import d3Data  from './data/d3.json'

const Home: React.FC = () => {
    // Sample data for D3 chart
    const creditScoreData = [
      { name: 'Excellent', value: 50 },
      { name: 'Good', value: 30 },
      { name: 'Fair', value: 10 },
      { name: 'Poor', value: 5 },
      { name: 'Bad', value: 5 }
    ];

    



    const [analysis, setAnalysis] =  useState<Analysis>();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [region, setRegion] = useState<string>('US');
    const [regionData, setRegionData] = useState<ScoreItem[]>([]);
    const [creditScore, setCreditScore] = useState<any>(null);

  

  const handleScore = (analysis: Analysis) => {
    setAnalysis(analysis);
    setCreditScore(analysis.score);
  };

    useEffect(() => {
        const fetchData = async () => {
          try {
            // Replace 'https://api.example.com/data' with your actual API endpoint
            const response = await axios.get('/api/loadChartData');
            setData(response.data); // Set the data from the response to your state
            setLoading(false); // Set loading to false since the data has been fetched


            const distribution = response.data.distribution;
            if (distribution) {
              const scores = response.data.distribution.filter((value: any) => {return value.code === region})[0].scores;
              console.log(scores);
              setRegionData(scores);
            }
            

          } catch (error) {
            if (axios.isAxiosError(error)) {
              // Handle Axios-specific error
              setError(error.message);
            } else {
              // Handle other errors
              setError('An unknown error occurred');
            }
            setLoading(false);
          }
        };
    
        fetchData();
      }, []); // The empty arra
  

    return (
        <div className='wrapper'>
            <AppBar position="static" sx ={{maxHeight:'64px'}}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Grid container spacing={2}  className='mainGrid'>
                <Grid item xs={12} md={3} style={{ marginTop:'16px', paddingTop: '2px'}} >
                    <ChatBot onScoreGenerated={handleScore}></ChatBot>  
                </Grid>
                <Grid item xs={12} md={9} id="ChartGrid">
                   <DonutChart scores={regionData} width={1000} creditScore={creditScore}></DonutChart>
                </Grid>
            </Grid>
        </div>
    );
};

export default Home;

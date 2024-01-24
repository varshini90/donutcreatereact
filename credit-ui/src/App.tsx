import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import './App.css';
import Home from './Home';

function App() {

  const data: any[] = [
    { value: 40 },
    { value: 25 },
    { value: 15 },
    { value: 8 },
    { value: 2 }
  ];
  return (
    <div className="App">
      <Home></Home>
    </div>
  );
}

export default App;

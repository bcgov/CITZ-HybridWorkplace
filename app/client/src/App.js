//
// Copyright © 2022 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

/**
 * Application entry point
 * @author [Jayna Bettesworth](bettesworthjayna@gmail.com)
 * @module
 */


import './App.css';



import React, { Component, useState, useEffect } from 'react';
import Routes from './routes';
import Container from '@mui/material/Container';

import { Provider } from 'react-redux';
import store from './store';

import Footer from './layout/footer'
import Header from './layout/header';

import Paper from '@mui/material/Paper'
import { ThemeProvider, createTheme } from '@mui/material/styles';



function App(){
  const [darkMode, setDarkMode] = useState(false)

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light'
    },
  });

  async function populateDark() {
    const req = await fetch('http://localhost:5000/api/editprofile', {
        headers: {
            'x-access-token': localStorage.getItem('token'),
        },
    })

    const data = await req.json()
    if(data.status === 'ok'){
      if(data.darkmode == undefined){
        setDarkMode(false)
      }else{
        setDarkMode(data.darkMode)
      }
        console.log(data.darkMode)
    }else{
        alert(data.error)
    }
}
useEffect(() => {
     populateDark()
}, [])

  
  return (
    <ThemeProvider theme={theme}>
    <Paper style={{ minHeight: '100vh'}}>
    <Provider store={store}>
    <div> 
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="App"> 
        <Container>
          <Routes />
        </Container>
      </div> 
      < Footer />
    </div>
    </Provider>
    </Paper>
    </ThemeProvider>
  );
}

export default App;

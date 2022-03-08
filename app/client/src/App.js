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

import Login from './Components/login';
import Register from './Components/register';
import Dashboard from './Components/dashboard';
import About from './Components/about';
import Profile from './Components/profile';
import EditProfile from './Components/editProfile';

import React, { Component, } from 'react';
import { Routes, Route } from 'react-router-dom';

import Footer from './Views/footer'
import Header from './Views/header';

class App extends Component {
  render() {
  return (
    <div> 
      <Header />
      <div className="App"> 
      
      <Routes> 
        <Route path="/login" exact element= {<Login /> }/>
			  <Route path="/" exact element={<Register />} />
			  <Route path="/dashboard" exact element={<Dashboard />} />  
        <Route path="/about" exact element={<About />} /> 
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile/:id/edit" element={<EditProfile />} />
      </Routes> 
      </div> 
      < Footer />
    </div>
  );
}

}

export default App;

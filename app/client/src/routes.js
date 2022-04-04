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

 import Login from 'views/login';
 import Register from 'views/register';
 import Home from 'views/home';
 import About from 'views/aboutPage';
 import ProfilePage from 'views/profilePage';
 import EditProfile from 'components/editProfile';
 import CreateCommunity from 'components/createCommunity';
 import CommunitiesPage from 'views/communitiesPage';
 import NewCommunity from 'components/newCommunity';
 
 import React, { Component, } from 'react';
 import { Routes, Route } from 'react-router-dom';
 
 
 class App extends Component {
   render() {
   return (
       <div className="Routes"> 
        <Routes> 
            <Route path="/login" exact element= {<Login /> }/>
            <Route path="/" exact element={<Register />} />
            <Route path="/home" exact element={<Home />} />  
            <Route path="/about" exact element={<About />} /> 
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/profile/:id/edit" element={<EditProfile />} />
            <Route path="/createCommunity" element={<CreateCommunity/>} />
            <Route path="/communities" element={<CommunitiesPage/>} />
            <Route path="/newCommunity" element={<NewCommunity/>} />
        </Routes> 
       </div> 
   );
 }
 
 }
 
 export default App;
 
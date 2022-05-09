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
 import React, { Component } from 'react';
 import {Link} from 'react-router-dom';
 import './sideMenu.css';
 import Menu from './icons/menuLogo.svg';
 import House from '@mui/icons-material/House'
 import Person from '@mui/icons-material/Person'
 import HelpCenter from '@mui/icons-material/HelpCenter'
 import LogOut from '@mui/icons-material/Logout'
 import DarkMode from '@mui/icons-material/DarkMode'
 import Group from '@mui/icons-material/Group'
 //import {logOff} from '../components/logout';


 const SideMenu = ({darkMode, setDarkMode}) => {
  async function openSlideMenu(){
    document.getElementById('menu').style.width = '250px';
    document.getElementById('menu').style.marginLeft = '250px';
    
  }  

  async function closeSlideMenu(){
    
    document.getElementById('menu').style.width = '0px';
    document.getElementById('menu').style.marginLeft = '0px';
  }
  async function updateDarkMode(event){
    event.preventDefault()
    setDarkMode(!darkMode)
    const req = await fetch(`${window._env_.API_REF}/editprofile`, {
       method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
            darkMode: darkMode,
        }),

    })
  }
  async function logOff(){
   
    fetch(`${window._env_.API_REF}/logout`, {
      headers: {
          'x-access-token': localStorage.getItem('token'),
      },
    })
    localStorage.removeItem('token')
  }

      return (
        <div id='content'>
            <span className='slide'>
              <a href="#" onClick={openSlideMenu}>
                <img src={Menu} id='Menu' alt="Profile" /> 
              </a> 
            </span>

            <div id='menu' className='nav'>
             <a href="#" className='close' onClick={closeSlideMenu} >
                ✖
             </a>
            <ul>
                <li><Link to='/home' ><House /> Home</Link></li>
                <li><Link to='./profile/:id' ><Person />  Profile</Link></li>
                <li><Link to='./communities' ><Group />  Communities</Link></li>
                <li><Link to='./posts' ><Group />  Posts</Link></li>
                <li><Link to='./about' ><HelpCenter />  About</Link></li>
                <li onClick={updateDarkMode} id='DMode'><DarkMode />  Dark Mode</li>
                <li onClick={logOff}><Link to='./login' ><LogOut /> Log Off</Link></li>
                
                
            </ul>
          

            </div>

         </div>

      )
    
 }
  
  export default SideMenu;

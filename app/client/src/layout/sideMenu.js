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

 const Header = () => {
  async function openSlideMenu(){
    console.log('hi');
    document.getElementById('menu').style.width = '250px';
    document.getElementById('menu').style.marginLeft = '250px';
    
  }  

  async function closeSlideMenu(){
    
    document.getElementById('menu').style.width = '0px';
    document.getElementById('menu').style.marginLeft = '0px';
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
                <li><Link to='/home' >Home</Link></li>
                <li><Link to='./about' >About</Link></li>
                <li><Link to='./communities' >Communities</Link></li>
                <li><Link to='./profile/:id' >Profile</Link></li>
                <li><Link to='./login' >Log Off</Link></li>
                <li><Link to='./home' >Dark Mode</Link></li>
            </ul>
          

            </div>

         </div>

      )
    }
  
  
  export default Header;
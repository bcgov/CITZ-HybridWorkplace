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
 import './header.css';
 import BCLogo from './icons/BCLogo.svg';
 import UserPic from './icons/user.png';
 import Menu from './icons/menuLogo.svg';

 class Header extends Component {
    render() {
      return (
        <div className='header' >
            <img src={BCLogo} className="App-logo" alt="logo" />
            <h2> The Neighbourhood </h2>
            <Link to='./profile/:id' id='Profile'>
              <img src={UserPic} id='Profile' alt="Profile" />  
            </Link>
            <img src={Menu} id='Menu' alt="Profile" />  
        </div>
      )
    }
  }
  
  export default Header;
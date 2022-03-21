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
 import React, { useEffect, useState } from 'react'
 import { Link } from 'react-router-dom';
 import UserPic from '../layout/icons/user.png'
 import './Styles/profile.css';
 import ProfileInfo from '../components/profileInfo';

 const Profile = () => {

     return (
         <div id='prof'>
             <div id='wrap'>
                <div id='imgPlace' >
                    <img src={UserPic} id='ProfilePic' alt="Profile" />
                </div>
                <div id='restPlace'>
                    <h1> Profile </h1>
                    <ProfileInfo />
                     <Link to="/profile/:id/edit">
                            edit Profile
                    </Link>
                </div>
                
            </div>
         </div>
     )
 }
 export default Profile;
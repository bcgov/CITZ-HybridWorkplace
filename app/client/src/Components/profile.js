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
 import jwt_decode from "jwt-decode";
 import { Link, useNavigate } from 'react-router-dom';
 import UserPic from '../Views/icons/user.png'
 import './Styles/profile.css'

 const Profile = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [title, setTitle] = useState('')
    const [name, setName] = useState('')
    const [fullName, setFullName] = useState('')
    const [bio, setBio] = useState('')

    async function populateQuote() {
        const req = await fetch('http://localhost:5000/api/profile', {
            headers: {
                'x-access-token': localStorage.getItem('token'),
            },
        })

        const data = await req.json()
        console.log(data)
        if(data.status === 'ok'){
            setEmail(data.email)
            setName(data.name)
            setTitle(data.title)
            setFullName(data.fullName)
            setBio(data.bio)
        }else{
            alert(data.error)
        }
    }
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token){
            const user = jwt_decode(token)
            if(!user){
                localStorage.removeItem('token')
                navigate('/login')
            }else{
                console.log(user.name)
                
                populateQuote()
            }
        }
    }, [])


     return (
         <div id='prof'>
             <div id='wrap'>
                <div id='imgPlace' >
                <img src={UserPic} id='ProfilePic' alt="Profile" />
                </div>
                <div id='restPlace'>
                    <h2>Profile</h2>
                    <h1>{fullName || ''}</h1>
                    <h3>{name}</h3>
                    <h5> {email} </h5>
                    <h3> {title || ''} </h3>
                    <h3> {bio || ''} </h3>
                    <Link to="/profile/:id/edit">
                    edit Profile
                    </Link>
                </div>
            </div>
         </div>
     )
 }
 export default Profile;
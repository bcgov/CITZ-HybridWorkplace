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
 import '../views/Styles/editprofile.css'

 const EditProfile = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [title, setTitle] = useState('')
    const [name, setName] = useState('')
    const [fullName, setFullName] = useState('')
    const [bio, setBio] = useState('')
    const [tempFullName, setTempFullName] = useState('')
    const [temptitle, setTempTitle] = useState('')
    const [tempBio, setTempBio] = useState('')

    async function populateProfile() {
        const req = await fetch(`${process.env.REACT_APP_API_REF}/editprofile`, {
            headers: {
                'x-access-token': localStorage.getItem('token'),
            },
        })

        const data = await req.json()
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
                populateProfile()
            }
        }
    }, [])

    async function updateTitle(event){
        event.preventDefault()
        const req = await fetch(`${process.env.REACT_APP_API_REF}/editprofile`, {
           method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({
                title: temptitle,
            }),
        })

        const data = await req.json()
        if(data.status === 'ok'){
                setTitle(temptitle)
         }else{
            alert(data.error)
        }
    } 
    async function updateFullName(event){
        event.preventDefault()
        const req = await fetch(`${process.env.REACT_APP_API_REF}/editprofile`, {
           method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({
                fullName: tempFullName,
            }),
        })

        const data = await req.json()
        if(data.status === 'ok'){
             setFullName(tempFullName)
        }else{
            alert(data.error)
        }
    } 
    async function updateBio(event){
        event.preventDefault()
        const req = await fetch(`${process.env.REACT_APP_API_REF}/editprofile`, {
           method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({
                bio: tempBio,
            }),
        })

        const data = await req.json()
        if(data.status === 'ok'){
                setBio(tempBio)
        }else{
            alert(data.error)
        }
    } 
     return (
         <div id='eprofile'>
             <h2>Edit your profile</h2>
             <p>ID: {name}</p>
             <p>Email: {email} </p>
             <form onSubmit={updateFullName}>
             <label htmlFor='fullname'>Full Name: </label>
             <br/>
                <input 
                    type='text' 
                    placeholder={fullName}
                    id='fullname'
                    value={tempFullName} 
                    onChange={(e) => setTempFullName(e.target.value)} 
                />
                <input type='submit' value='✓' id='check'/>
                </form>
                <form onSubmit={updateTitle}>
                <br/>
                <label htmlFor='title'>Title: </label>
                <br/>
                <input 
                    type='text' 
                    placeholder={title}
                    id='title'
                    value={temptitle} 
                    onChange={(e) => setTempTitle(e.target.value) }
                />
                <input type='submit' value='✓' id='check'/>
                </form>
                <form onSubmit={updateBio}>
                <br/>
                <label htmlFor='bio'>Bio: </label>
                <br/>
                <textarea 
                    
                    placeholder={bio}
                    id='bio'
                    value={tempBio} 
                    onChange={(e) => setTempBio(e.target.value) }
                />
                <input type='submit' value='✓' id='check' />
                </form>
                <Link to="/profile/:id">
              <button type='button' className='LogInbutton'>Done</button>
            </Link>
            <br/>
         </div>
     )
 }
 export default EditProfile;

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
 import { useNavigate } from 'react-router-dom';
 import { useDispatch } from 'react-redux';
 import { createPost } from '../../actions/postActions';
 import './addPost.css'
 import Paper from '@mui/material/Paper'
 
 const CreatePost = (props) => {

    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    
    async function registerPost(event) {
        event.preventDefault();
        const post = {
            title: title, 
            description: description,
            creator: name
        };
        dispatch(createPost(post));
        window.location.reload() 
       // navigate('/posts')
      }

      async function userInfo() {

        const req = await fetch('http://localhost:5000/api/profile', {
            headers: {
                'x-access-token': localStorage.getItem('token'),
            },
        })

        const data = await req.json()
        if(data.status === 'ok'){
            setName(data.name)
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
                userInfo();
                
            }
        }
    }, [])

    
     return (
         <div className={`modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
             <div className='modalWrap' onClick={e => e.stopPropagation()}>
                 <Paper  >
                <br />
                <h1>Add Post</h1>
                <form onSubmit={registerPost}>
                    <input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        type='text'
                        placeholder='Title'
                    />
                    <br/>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        type='text'
                        placeholder='Description'
                    />
                    <br/>
                    <input type='submit' value='Submit' id='submit' />
                </form>
                <br/>
                </Paper>
            </div> 
         </div>	
     )
 }
 
 export default CreatePost;
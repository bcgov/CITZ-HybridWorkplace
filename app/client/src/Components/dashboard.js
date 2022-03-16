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


const Dashboard = () => {
	const navigate = useNavigate();
    const [name, setName] = useState('')

    async function populateQuote() {
        const req = await fetch('http://localhost:5000/api/quote', {
            headers: {
                'x-access-token': localStorage.getItem('token'),
            },
        })

        const data = await req.json()
        console.log(data)
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
                console.log(user.name)
                
                populateQuote()
            }
        }
    }, [])


	return (
		<div>
            <Link to="/profile/:id">
              <button type='button' className='LogInbutton'>Profile</button>
            </Link>
            <Link to="/createCommunity">
              <button type='button' className='LogInbutton'>Create Community</button>
            </Link>
            <h2>{name}</h2>
            <h1>HomePage</h1> 
        </div>	
	)
}

export default Dashboard
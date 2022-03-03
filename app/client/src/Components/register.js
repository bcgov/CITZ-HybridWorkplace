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


 import '../App.css';
 import Footer from '../Views/footer';
 import {useState} from 'react';
 import {useNavigate, Link} from 'react-router-dom';
 
 function App() {
   const history = useNavigate();
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
 
   async function registerUser(event) {
     event.preventDefault()
 
     const response = await fetch('http://localhost:5000/api/register', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },  
     body: JSON.stringify({
         name,
         email,
         password,
       }),
     })
 
     const data = await response.json()
     console.log(data);
     if (data.status === 'ok'){
      window.location='/login'
     }
   }
 
   return (
     <div className="App">
       <h1>Welcome to The Neighbourhood</h1>
       <p> The Neighbourhood is a place to share and view expiriences to make us all better leaders and learners</p>
       <Link to="/about"> Learn More Here </Link>
       <br/>
       <br/>
       <h2> Register</h2>
       <form onSubmit={registerUser}>
         <input 
           value={name}
           onChange={(e) => setName(e.target.value)}
           type='text'
           placeholder='ID'
         />
         <br/>
         <input 
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           type='email'
           placeholder='Email'
         />
         <br/>
         <input 
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           type='password'
           placeholder='Password'
         />
         <br/>
         <br />
         <input type='submit' value='Submit' />
       </form>
       <br />
       <br />
       <p> Already have an account?  
         {' '}
       <Link to="/login">
              Log In
       </Link>
       </p>
     </div>
     
   );
 }
 
 export default App;
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

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import '../views/Styles/register.css';

function App() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  async function registerUser(event) {
    event.preventDefault()
    if (password !== rePassword) {
      alert("Password's do not match, please try again");
    }

    const response = await fetch(`${window._env_.API_REF}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    if (response.status === 403) {
      alert(response.body);
    }
    else if (response.status === 201) {
      navigate('/login');
    } else {
      alert('Bad Request.');
    }
  }

  async function PasswordRequirment() {
    const myInput = document.getElementById("psw");
    const letter = document.getElementById("letter");
    const capital = document.getElementById("capital");
    const number = document.getElementById("number");
    const length = document.getElementById("length");

    //clicks on the password field, show the message box
    myInput.onfocus = function () {
      document.getElementById("message").style.display = "block";
    }

    // Clicks outside of the password field, hide the message box
    myInput.onblur = function () {
      document.getElementById("message").style.display = "none";
    }

    // When the user starts to type something inside the password field
    myInput.onkeyup = function () {
      // Validate the lowercase letters
      const lowerCaseLetters = /[a-z]/g;
      if (myInput.value.match(lowerCaseLetters)) {
        letter.classList.remove("invalid");
        letter.classList.add("valid");
      } else {
        letter.classList.remove("valid");
        letter.classList.add("invalid");
      }

      // Validate the capital letters
      const upperCaseLetters = /[A-Z]/g;
      if (myInput.value.match(upperCaseLetters)) {
        capital.classList.remove("invalid");
        capital.classList.add("valid");
      } else {
        capital.classList.remove("valid");
        capital.classList.add("invalid");
      }

      // Validate the numbers
      const numbers = /[0-9]/g;
      if (myInput.value.match(numbers)) {
        number.classList.remove("invalid");
        number.classList.add("valid");
      } else {
        number.classList.remove("valid");
        number.classList.add("invalid");
      }

      // Validate the length
      if (myInput.value.length >= 8) {
        length.classList.remove("invalid");
        length.classList.add("valid");
      } else {
        length.classList.remove("valid");
        length.classList.add("invalid");
      }
    }
  }

  return (
    <div className="Register">

      <div id='register'>

        <h1> Sign Up</h1>
        <br />
        <form onSubmit={registerUser}>
          <div className="inputWrap">
            <label>IDIR:</label>
            <br />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type='text'
              className='divBox'
              placeholder='ID'
            />
          </div>
          <br />

          <div className="inputWrap">
            <label>Email:</label>
            <br />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type='email'
              className='divBox'
              placeholder='Email'
            />
          </div>
          <br />
          <div className="inputWrap">
            <label>Password:</label>
            <br />
            <input
              value={password}
              onChange={(e) => { PasswordRequirment(); setPassword(e.target.value) }}
              type='password'
              placeholder='Password'
              id="psw"
              name="psw"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Password must contain at least one number, uppercase, and lowercase letter, and at least 8 or more characters"
            />
          </div>
          <br />
          <div className="inputWrap">
            <label>Re-Enter Password:</label>
            <br />
            <input
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              type='password'
              placeholder='Password'
              className='divBox'
            />
          </div>
          <br />
          <br />
          <input type='submit' value='Submit' id='submit' />
        </form>
      </div>
      <div id="message">
        <h4> Password must contain the following:</h4>
        <p id="letter" className="invalid">One <b>lowercase</b> letter</p>
        <p id="capital" className="invalid">One <b>uppercase</b> letter</p>
        <p id="number" className="invalid">One <b>number</b></p>
        <p id="length" className="invalid">Minimum <b>8 characters</b></p>
      </div>
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

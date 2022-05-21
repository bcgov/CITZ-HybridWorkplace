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

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../views/Styles/editprofile.css";

const apiURI =
  window._env_.REACT_APP_LOCAL_DEV === ""
    ? `${window._env_.REACT_APP_API_REF}`
    : `http://${window._env_.REACT_APP_API_REF}:${window._env_.REACT_APP_API_PORT}`;

const EditProfile = () => {
  //const navigate = useNavigate();

  const [email, setEmail] = useState("Undefined");
  const [title, setTitle] = useState("Undefined");
  const [name, setName] = useState("Undefined");
  const [fullName, setFullName] = useState("Undefined");
  const [bio, setBio] = useState("Undefined");
  const [tempFullName, setTempFullName] = useState("Undefined");
  const [temptitle, setTempTitle] = useState("Undefined");
  const [tempBio, setTempBio] = useState("Undefined");

  async function populateProfile() {
    const response = await fetch(`${apiURI}/api/profile`, {
      //headers: {
      //    'x-access-token': localStorage.getItem('token'),
      //},
    });

    const data = await response.json();

    if (response.status === 200) {
      setEmail(data.email);
      setName(data.name);
      setTitle(data.title);
      setFullName(data.fullName);
      setBio(data.bio);
    } else {
      alert(
        "At least one field in JSON is undefined, line 56, editProfile.js: " +
          data.error
      );
    }
  }

  /*
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
    }, []);
    */

  async function updateTitle(event) {
    event.preventDefault();
    const response = await fetch(`${apiURI}/api/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //'x-access-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({
        title: temptitle,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      setTitle(temptitle);
    } else {
      alert(
        "At least one field in JSON is undefined, line 93, editProfile.js: " +
          data.error
      );
    }
  }

  async function updateFullName(event) {
    event.preventDefault();
    const response = await fetch(`${apiURI}/api/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //'x-access-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({
        fullName: tempFullName,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      setFullName(tempFullName);
    } else {
      alert(
        "At least one field in JSON is undefined, line 114, editProfile.js: " +
          data.error
      );
    }
  }

  async function updateBio(event) {
    event.preventDefault();
    const response = await fetch(`${apiURI}/api/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //'x-access-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({
        bio: tempBio,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      setBio(tempBio);
    } else {
      alert(
        "At least one field in JSON is undefined, line 137, editProfile.js: " +
          data.error
      );
    }
  }

  return (
    <div id="eprofile">
      <h2>Edit your profile</h2>
      <p>ID: {name}</p>
      <p>Email: {email} </p>
      <form onSubmit={updateFullName}>
        <label htmlFor="fullname">Full Name: </label>
        <br />
        <input
          type="text"
          placeholder={fullName}
          id="fullname"
          value={tempFullName}
          onChange={(e) => setTempFullName(e.target.value)}
        />
        <input type="submit" value="✓" id="check" />
      </form>
      <form onSubmit={updateTitle}>
        <br />
        <label htmlFor="title">Title: </label>
        <br />
        <input
          type="text"
          placeholder={title}
          id="title"
          value={temptitle}
          onChange={(e) => setTempTitle(e.target.value)}
        />
        <input type="submit" value="✓" id="check" />
      </form>
      <form onSubmit={updateBio}>
        <br />
        <label htmlFor="bio">Bio: </label>
        <br />
        <textarea
          placeholder={bio}
          id="bio"
          value={tempBio}
          onChange={(e) => setTempBio(e.target.value)}
        />
        <input type="submit" value="✓" id="check" />
      </form>
      <Link to="/profile/:id">
        <button type="button" className="LogInbutton">
          Done
        </button>
      </Link>
      <br />
    </div>
  );
};

export default EditProfile;

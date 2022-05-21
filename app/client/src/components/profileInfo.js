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
import { useNavigate } from "react-router-dom";

const apiURI =
  window._env_.LOCAL_DEV === ""
    ? `${window._env_.REACT_APP_API_REF}`
    : `http://${window._env_.REACT_APP_API_REF}:${window._env_.REACT_APP_API_PORT}`;

const Profile = () => {
  //const navigate = useNavigate();

  const [email, setEmail] = useState("Undefined");
  const [title, setTitle] = useState("Undefined");
  const [name, setName] = useState("Undefined");
  const [fullName, setFullName] = useState("Undefined");
  const [bio, setBio] = useState("Undefined");

  async function populateQuote() {
    const response = await fetch(`${apiURI}/api/profile`, {
      headers: {
        //'x-access-token': localStorage.getItem('token'),
      },
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
        "At least one field in JSON is undefined, line 50, profileInfo.js: " +
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
                 
                populateQuote()
            }
        }
    }, []);
    */

  return (
    <div>
      <h3>{fullName || ""}</h3>
      <h4>{name}</h4>
      <p> {email} </p>
      <p> {title || ""} </p>
      <br />
      <p> {bio || ""} </p>
    </div>
  );
};

export default Profile;

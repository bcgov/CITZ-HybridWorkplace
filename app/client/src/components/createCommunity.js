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
import { useDispatch } from "react-redux";

import { createCommunity } from "../redux/ducks/communityDuck";

const CreateCommunity = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("Undefined");

  async function registerCommunity(event) {
    event.preventDefault();
    const community = {
      title: title,
      description: description,
      creator: name,
    };
    dispatch(createCommunity(community));
    navigate("/home");
  }

  /*
    async function userInfo() {

        const response = await fetch(`${window._env_.REACT_APP_API_REF}/profile`, {
            //headers: {
            //    'x-access-token': localStorage.getItem('token'),
            //},
        });

        if (response.status === 200) {
            setName(data.name);
        } else {
            alert("At least one field in JSON is undefined, line 59, createCommunity.js: " + data.error);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            const user = jwt_decode(token);
            if (!user) {
                //localStorage.removeItem('token')
                navigate('/login');
            } else {
                userInfo();
            }
        }
    }, []);
    */

  return (
    <div>
      <h1>Create Community</h1>
      <form onSubmit={registerCommunity}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Title"
        />
        <br />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          placeholder="Description"
        />
        <br />
        <input type="submit" value="Submit" id="submit" />
      </form>
    </div>
  );
};

export default CreateCommunity;

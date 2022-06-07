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

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../redux/ducks/authDuck";
import "../views/Styles/login.css";

function LoginPage(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function loginUser(event) {
    event.preventDefault();
    const successful = await props.login(username, password);
    if (successful === true) navigate("/home");
  }

  return (
    <div className="LogIn">
      <h1>Login</h1>
      <br />
      <form onSubmit={loginUser}>
        <div className="inputWrap">
          <label>IDIR:</label>
          <br />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="name"
            placeholder="ID"
            className="divBox"
          />
        </div>
        <br />

        <div className="inputWrap">
          <label>Password:</label>
          <br />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="divBox"
          />
        </div>
        <br />
        <br />
        <input type="submit" value="Submit" id="submit" />
      </form>
      <Link to="/" id="link">
        Forgot Password?
      </Link>
      <br />
      <br />
      <br />
      <Link to="/" id="link">
        Sign Up
      </Link>
    </div>
  );
}

export default connect(null, { login })(LoginPage);

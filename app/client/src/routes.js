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

import "./App.css";
import React, { Component } from "react";
import { Routes, Route } from "react-router-dom";

import PrivateComponent from "./privateComponent";

// Views
import Login from "./views/login";
import Register from "./views/register";
import Home from "./views/home";
import About from "./views/aboutPage";
import ProfilePage from "./views/profilePage";
import CommunitiesPage from "./views/communitiesPage";
import Posts from "./views/posts";
import NotFoundPage from "./views/404Page";

//Components
import EditProfile from "./components/editProfile";
import NewCommunity from "./components/newCommunity";

class App extends Component {
  render() {
    return (
      <div className="Routes">
        <Routes>
          <Route path="/" exact element={<Register />} />
          <Route path="/login" exact element={<Login />} />
          <Route
            path="/home"
            exact
            element={<PrivateComponent component={<Home />} />}
          />
          <Route
            path="/about"
            exact
            element={<PrivateComponent component={<About />} />}
          />
          <Route
            path="/profile/:id"
            element={<PrivateComponent component={<ProfilePage />} />}
          />
          <Route
            path="/profile/:id/edit"
            element={<PrivateComponent component={<EditProfile />} />}
          />
          <Route
            path="/communities"
            element={<PrivateComponent component={<CommunitiesPage />} />}
          />
          <Route
            path="/newCommunity"
            element={<PrivateComponent component={<NewCommunity />} />}
          />
          <Route
            path="/posts"
            element={<PrivateComponent component={<Posts />} />}
          />
          <Route path="*" exact element={<NotFoundPage />}></Route>
        </Routes>
      </div>
    );
  }
}

export default App;

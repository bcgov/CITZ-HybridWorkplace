//
// Copyright Â© 2022 Province of British Columbia
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

import PrivateComponent from "./components/PrivateComponent";

// Views
import LoginPage from "./views/LoginPage";
import Register from "./views/RegisterPage";
import HomePage from "./views/HomePage";
import AboutPage from "./views/AboutPage";
import ProfilePage from "./views/ProfilePage";
import CommunitiesPage from "./views/CommunitiesPage";
import PostsPage from "./views/PostsPage";
import Page404 from "./views/Page404";
import CommunityPage from "./views/CommunityPage";

//Components
import EditProfile from "./components/EditProfile";
import NewCommunity from "./components/NewCommunity";
import SingularPost from "./components/SingularPost";
import LogoutPage from "./views/LogoutPage";

const App = () => {
  return (
    <div className="Routes">
      <Routes>
        <Route path="/" exact element={<Register />} />
        <Route path="/login" exact element={<LoginPage />} />
        <Route
          path="/home"
          exact
          element={<PrivateComponent component={<HomePage />} />}
        />
        <Route
          path="/about"
          exact
          element={<PrivateComponent component={<AboutPage />} />}
        />
        <Route
          path="/profile/:username"
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
          element={<PrivateComponent component={<PostsPage />} />}
        />
        <Route
          path="/community/:title"
          element={<PrivateComponent component={<CommunityPage />} />}
        />
        <Route
          path="/post/:id"
          element={
            <PrivateComponent component={<SingularPost showComments />} />
          }
        />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="*" exact element={<Page404 />}></Route>
      </Routes>
    </div>
  );
};

export default App;

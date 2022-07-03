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
import React, { Component, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { isAPIHealthy } from "./helperFunctions/isAPIHealthy";

import PrivateComponent from "./components/PrivateComponent";
import GuestOnlyComponent from "./components/GuestOnlyComponent";

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
import LogoutPage from "./views/LogoutPage";
import PostPage from "./views/PostPage";
import { useTransition } from "react";
import LoadingPage from "./views/LoadingPage";
import APIDownPage from "./views/APIDownPage";

const App = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [apiIsHealthy, setApiIsHealthy] = useState(false);

  useEffect(() => {
    (async () => {
      setApiIsHealthy(await isAPIHealthy());
      setIsLoading(false);
    })();
  }, []);

  //If loading from the apiHealth Call, display the loading page
  return isLoading ? (
    <LoadingPage />
  ) : //else, if not loading, conditionally show the API Down page or actually navigate to the website
  !apiIsHealthy ? (
    <APIDownPage />
  ) : (
    <div className="Routes">
      <Routes>
        <Route
          path="/register"
          exact
          element={<GuestOnlyComponent component={<Register />} />}
        />
        <Route
          path="/login"
          exact
          element={<GuestOnlyComponent component={<LoginPage />} />}
        />
        <Route
          path="/"
          exact
          element={<PrivateComponent component={<HomePage />} />}
        />
        <Route path="/about" exact element={<AboutPage />} />
        <Route
          path="/profile/:username"
          element={<PrivateComponent component={<ProfilePage />} />}
        />
        <Route
          path="/profile/:username/edit"
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
          element={<PrivateComponent component={<PostPage />} />}
        />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="*" exact element={<Page404 />}></Route>
      </Routes>
    </div>
  );
};

export default App;

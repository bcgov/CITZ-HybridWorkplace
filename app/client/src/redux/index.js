/* 
 Copyright © 2022 Province of British Columbia

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * Application entry point
 * @author [Zach Bouruqe](zachbourque01@gmail.com)
 * @module
 */

import { combineReducers } from "redux";

// Ducks
import { communityReducer } from "./ducks/communityDuck";
import { postReducer } from "./ducks/postDuck";
import { authReducer } from "./ducks/authDuck";
import { profileReducer } from "./ducks/profileDuck";
import { alertReducer } from "./ducks/alertDuck";

export default combineReducers({
  communities: communityReducer,
  posts: postReducer,
  auth: authReducer,
  profile: profileReducer,
  alerts: alertReducer,
});

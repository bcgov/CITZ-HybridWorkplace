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
 * @author [Jayna Bettesworth](bettesworthjayna@gmail.com)
 * @module
 */

 import { GET_POSTS, ADD_POST } from "./types";


 export const getPosts = () => dispatch => {
    fetch(`${process.env.REACT_APP_API_REF}/post`)
        .then(res => res.json())
        .then(posts => dispatch({
            type: GET_POSTS,
            payload: posts
        }));
 }
 
 
 export const createPost = postData => dispatch => {

     fetch(`${process.env.REACT_APP_API_REF}/post`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },  
         body: JSON.stringify({
             title: postData.title,
             message: postData.message,
             creator: postData.creator,
             community: postData.community,
           }),
         })
         .then(res => res.json())
         .then(post => 
             dispatch({
                 type: ADD_POST,
                 payload: post
             }));       
         
 }
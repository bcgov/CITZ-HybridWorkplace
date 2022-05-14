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
 * @author [Zach Bourque](zachbourque01@gmai.com)
 * @module
*/

const GET_POSTS = 'CITZ-HYBRIDWORKPLACE/POST/GET_COMMUNITIES';
const ADD_POST = 'CITZ-HYBRIDWORKPLACE/POST/ADD_COMMUNITY';

export const getPosts = () => (dispatch) => {
    fetch(`${window._env_.API_REF}/post`)
        .then(res => res.json())
        .then(posts => dispatch({
            type: GET_POSTS,
            payload: posts
        }))
        .catch(error => {
            console.error(error)
        })
}

export const createPost = (postData) => (dispatch) => {

    fetch(`${window._env_.API_REF}/post`, {
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
        .then(post => (
            dispatch({
                type: ADD_POST,
                payload: post
            })
        ))
        .catch(error => {
            console.error(error)
        })
}

const initialState = {
    items: [], //communitys
    item: {} //single community
}

export function postReducer(state = initialState, action) {
    switch (action.type) {
        case GET_POSTS:
            return {
                ...state,
                items: action.payload
            }
        case ADD_POST:
            return {
                ...state,
                items: [...state.items, action.payload]
            }
        default:
            return state;
    }
}

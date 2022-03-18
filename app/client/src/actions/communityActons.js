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

import { GET_COMMUNITIES, ADD_POST } from "./types";


export const getCommunities = () => dispatch => {
        fetch('http://localhost:5000/api/Community')
            .then(res => res.json())
            .then(communities => dispatch({
                type: GET_COMMUNITIES,
                payload: communities
            }));
    
}


export const createCommunity = communityData => dispatch => {
    
    console.log('hi');
    fetch('http://localhost:5000/api/Community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },  
        body: JSON.stringify({
            title: communityData.title,
            description: communityData.description,
          }),
        })
        .then(res => res.json())
        .then(community => 
            dispatch({
                type: ADD_POST,
                payload: community
            }));       
        
}

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

<<<<<<< HEAD
import { GET_COMMUNITIES, ADD_COMMUNITY} from "../actions/types"
=======
import { GET_COMMUNITIES, ADD_POST } from '../actions/types'
>>>>>>> 5d08463 (fix)

const initialState = {
    items: [], //communitys
    item: {}, //single community
}
export default function (state = initialState, action) {
    switch (action.type) {
        case GET_COMMUNITIES:
            return {
                ...state,
                items: action.payload,
            }

        case ADD_COMMUNITY:
            console.log('yes')
            return {
                ...state,
                items: [...state.items, action.payload],
            }
        default:
            return state
    }
}

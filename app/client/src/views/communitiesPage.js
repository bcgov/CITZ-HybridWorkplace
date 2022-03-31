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

 import React, { Component } from 'react';
 import Communities from '../components/communitiesList';
 import {Link} from 'react-router-dom';

 class CommunitiesPage extends Component{

    render () {
        return(
            <div>
                <h1>Communities</h1>
                <Communities/>
                <br/>
                <Link to='/createCommunity'>
                    <button >Create New Community</button>
                </Link>

            </div>
        )
    }
 }
 export default CommunitiesPage;
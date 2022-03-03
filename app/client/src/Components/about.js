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

const about =  () => {
    return (
        <div>
            <h1> Welcome to the Neigbourhood</h1>
            
            <p> The Neighbourhood is a place where users are free to post there expiriences and questions. It is an open and safe environment
                to crowdsource ideas with coworkers. You can join communities based on your interests, post, comment and vote while interacting
                 with other users.
            </p>
            <br/>
            <h2> The Rules:</h2>
            <p> The neighborhood is a safe space for public servants to post and interact with other public servants. Because of this, please follow 
                the rules listed below to ensure it's a safe space for everyone. 
            </p>
            <ul>
                <li>no inapropriate language</li>
            </ul>
            
        </div>
    )
}
export default about;
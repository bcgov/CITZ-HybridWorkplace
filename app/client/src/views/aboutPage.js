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
            <h1> Hybrid Workplace: The Neigbourhood</h1>
            <br/>
            <p>Is a collaboration tool for internal government communities as per our problem statement
            </p>
            <p>VERSION.BUILD v.1.0.1</p>
            <br/>
            <h2> Developed By:</h2>
            <p> Abby: a.ulveland@gmail.com </p>
              <p>  Jayna: bettesworthjayna@gmail.com </p>
              <br />
            <p> This project is open sourced for fair use, with attribution.</p> 
             <p>   This work carried no warranty or implied guarantee. </p>
             <p>   All third party libraries are those of their rightful owners or licensees. </p>
              <p>  BC government theme © 2020 by the Government of BC </p>
            <br/>
            <h2>Platform:</h2>
            <p>Developed using React.js, Node.js, MongoDB and Express hosted on the http://BCDevExchange.org DevOps Environment.</p>
            <p>Addingtional info: http://github.com/bcgov/CITZ-HybridWorkplace</p>
            <br/>
            <h2>Features Include:</h2>
            <ul>
                <li>User Account Managmanet</li>
                <ul>
                    <li>Registration</li>
                    <li>Login/Logout</li>
                </ul>
                <li>Community Collaberation</li>
                <ul>
                    <li>Create a Community</li>
                    <li>Join / Leave a Community</li>
                    <li>List all Communities</li>
                    <li>Create a posting in a Community</li>
                </ul>
                <li>APIs</li>
                <br />
               
            </ul>
            
        </div>
    )
}
export default about;
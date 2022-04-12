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
import './Styles/about.css'
const about =  () => {
    return (
        <div>
            <h1> Hybrid Workplace: The Neigbourhood</h1>
            <p>Is a collaboration tool for internal government communities as per our problem statement
            </p>
            <p>VERSION.BUILD v.1.0.1</p>
            <br/>
            <h2> Developed By:</h2>
            <ul className="no-bullets" >
                <li> Abby: a.ulveland@gmail.com </li>
                <li>  Jayna: bettesworthjayna@gmail.com </li>
            </ul>
              <br />
            <ul className="no-bullets" >
            <li> This project is open sourced for fair use, with attribution.</li> 
             <li>   This work carried no warranty or implied guarantee. </li>
             <li>   All third party libraries are those of their rightful owners or licensees. </li>
              <li>  BC government theme © 2020 by the Government of BC </li>
              </ul>
            <br/>
            <h2>Platform:</h2>
            <ul className="no-bullets" >
            <li>Developed using React.js, Node.js, MongoDB and Express hosted on the <a target="_blank" rel="noopener noreferrer" href='http://BCDevExchange.org'>http://BCDevExchange.org</a> DevOps Environment.</li>
            <li>Addingtional info: <a target="_blank" rel="noopener noreferrer" href='http://github.com/bcgov/CITZ-HybridWorkplace'>http://github.com/bcgov/CITZ-HybridWorkplace</a></li>
            </ul>
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
                <br/>
               
            </ul>
            
        </div>
    )
}
export default about;
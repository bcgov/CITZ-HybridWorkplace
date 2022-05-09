//
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

 import React, { Component } from 'react';
 import {Link} from 'react-router-dom';
 import styled from 'styled-components';
 import { ExternalLink } from 'react-external-link';
 import './footer.css';
 
 const StyledLink = styled(Link)`
   color: White;
   text-decoration: none;
   margin: 1rem;
   position: relative;
 `;
 
 const StyledExLink = styled(ExternalLink)`
   color: White;
   text-decoration: none;
   margin: 1rem;
   position: relative;
 `;
 
 class Footer extends Component {
   render() {
     return (
       <div className='footer' >
           
             <StyledLink to="/">Home</StyledLink>
             <StyledExLink href={'placeholder' + 'disclaimer'} target="_blank" rel="noopener noreferrer">Disclaimer</StyledExLink>
             <StyledExLink href={'placeholder' + 'privacy'} target="_blank" rel="noopener noreferrer">Privacy</StyledExLink>
             <StyledExLink href={'placeholder' + 'accessability'} target="_blank" rel="noopener noreferrer">Accessability</StyledExLink>
             <StyledExLink href={'placeholder' + 'copyright'} target="_blank" rel="noopener noreferrer">Copyright</StyledExLink>
       </div>
     )
   }
 }
 
 export default Footer;

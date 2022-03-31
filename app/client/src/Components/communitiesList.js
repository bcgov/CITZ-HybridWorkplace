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
import { connect } from 'react-redux';
import { getCommunities } from '../actions/communityActons';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';


 class Communities extends Component {


    componentDidMount(){
        this.props.getCommunities();
    }
  render() {
      const communityItems = this.props.communities.map(community => (
          <div key={community._id}>
            <Paper
             sx={{
              px: 1,
              py: 0,
              margin: 'auto'
             }}
             variant="outlined" square 
             >
              <h3>{community.title}</h3>
              <p><small> { community.creator}</small></p>
              <p>{community.description}</p>
              
              </Paper>
          </div>
      ))
    return (
      <div>
        {communityItems}
      </div>
    )
  }
}

Communities.propTypes = {
    getCommunities: PropTypes.func.isRequired, 
    communities: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
    communities: state.communities.items 

});

export default connect(mapStateToProps, {getCommunities})(Communities);

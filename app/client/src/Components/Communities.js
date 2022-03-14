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
import { getCommunities } from '../actions/communityActons'
import PropTypes from 'prop-types';

 class Communities extends Component {

    // constructor(props){
    //     super(props);
    //     this.state = {
    //         posts: []
    //     };
    // }
    //  componentDidMount(){
    //      console.log(123)
    //      fetch('http://localhost:5000/api/Community')
    //         .then(res => res.json())
    //         .then(data => this.setState({ posts: data}));
    //  }

    componentDidMount(){
        this.props.getCommunities();
    }
  render() {
      const communityItems = this.props.communities.map(community => (
          <div key={community._id}>
              <h3>{community.title}</h3>
              <p>{community.description}</p>
              <hr />
          </div>
      ))
    return (
      <div>
        <p> Communities</p>
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
    communities: state.communities.items //communities is set as community reducer in reducer

});

export default connect(mapStateToProps, {getCommunities})(Communities);

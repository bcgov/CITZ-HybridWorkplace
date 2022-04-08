
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

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
              <p>{community.title}</p>   
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

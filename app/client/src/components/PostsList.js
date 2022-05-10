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

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getPosts } from '../actions/postActions';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';




const PostsList = (props) => {

  useEffect(() => {
    props.getPosts()
  }, [props])

  return (
    <div>
      {
        props.posts.map(post => (
          <div key={post._id}>
            <Paper
              sx={{
                px: 1,
                py: 0,
                margin: 'auto'
              }}
              variant="outlined"
              square>
              <h3>{post.title}</h3>
              <p>{post.message}</p>
            </Paper>
          </div>
        ))
      }
    </div>
  )
}


PostsList.propTypes = {
  getPosts: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  posts: state.posts.items

});

export default connect(mapStateToProps, { getPosts })(PostsList);

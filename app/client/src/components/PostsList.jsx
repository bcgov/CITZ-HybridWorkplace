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

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Post from "./Post";
import FlagPostModal from "./modals/FlagPostModal";
import DeletePostModal from "./modals/DeletePostModal";
import EditPostModal from "./modals/EditPostModal";

const PostsList = (props) => {
  return (
    <div>
      {props.posts?.map((post) => (
        <Post post={post} key={post._id} />
      ))}
      <FlagPostModal />
      <DeletePostModal />
      <EditPostModal />
    </div>
  );
};

PostsList.propTypes = {
  posts: PropTypes.array,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(PostsList);

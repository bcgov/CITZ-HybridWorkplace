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

import React, { useEffect, useState } from "react";

import PostsList from "../components/PostsList";
import { getPosts } from "../redux/ducks/postDuck";
import AddPostModal from "../components/modals/AddPostModal";
import { connect } from "react-redux";

const PostsPage = (props) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    props.getPosts();
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      <PostsList posts={props.posts} />
      <br />
      <button onClick={() => setShow(true)}>Add Post</button>
      <AddPostModal onClose={() => setShow(false)} show={show} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  posts: state.posts.items,
});

const mapActionsToProps = {
  getPosts,
};

export default connect(mapStateToProps, mapActionsToProps)(PostsPage);

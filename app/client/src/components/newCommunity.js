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
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createCommunity } from '../redux/ducks/communityDuck';

const NewCommunity = (props) => {

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const onTitleChange = (e) => {
    setTitle(e.target.value)
  }

  const onDescriptionChange = (e) => {
    setDescription(e.target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault();

    const community = {
      title,
      description
    };

    props.createCommunity(community);

    window.location.href = './communities';
  }
  return (
    <div>
      <h1>Create New Community</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>Title: </label>
          <br />
          <input
            type="text"
            name="title"
            onChange={onTitleChange}
            value={title}
          />
        </div>
        <br />
        <div>
          <label>Description: </label>
          <br />
          <textarea
            name="description"
            onChange={onDescriptionChange}
            value={description}
          />
        </div>
        <br />
        <button type="submit">Submit</button>
      </form>
      <hr />
    </div>
  );
}

NewCommunity.propTypes = {
  createCommunity: PropTypes.func.isRequired
};

export default connect(null, { createCommunity })(NewCommunity);

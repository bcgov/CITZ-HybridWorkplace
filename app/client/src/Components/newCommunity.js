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
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createCommunity } from '../actions/communityActons';

class newCommunity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();


    const community = {
      title: this.state.title,
      description: this.state.description
    };

    this.props.createCommunity(community);

     window.location.href='./communities';
  }

  render() {
    return (
      <div>
        <h1>Create New Community</h1>
        <form onSubmit={this.onSubmit}>
          <div>
            <label>Title: </label>
            <br />
            <input
              type="text"
              name="title"
              onChange={this.onChange}
              value={this.state.title}
            />
          </div>
          <br />
          <div>
            <label>Description: </label>
            <br />
            <textarea
              name="description"
              onChange={this.onChange}
              value={this.state.description}
            />
          </div>
          <br />
          <button type="submit">Submit</button>
        </form>
        <hr />
      </div>
    );
  }
}

newCommunity.propTypes = {
  createCommunity: PropTypes.func.isRequired
};

export default connect(null, { createCommunity })(newCommunity);
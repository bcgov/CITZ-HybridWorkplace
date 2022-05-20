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

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./addPost.css";

import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";

import { getCommunities } from "../../redux/ducks/communityDuck";
import { createPost } from "../../redux/ducks/postDuck";

const CreatePost = (props) => {
  const [title, setTitle] = useState("Undefined");
  const [message, setMessage] = useState("Undefined");

  const apiURI =
    window._env_.API_REF === ""
      ? `${process.env.REACT_APP_API_REF}`
      : `${window._env_.API_REF}:${window._env_.API_PORT}`;

  const userInfo = () => {
    fetch(`${apiURI}/api/profile`, {
      headers: {
        //'x-access-token': localStorage.getItem('token'),
      },
    })
      .then((res) => res.json())
      .then((data) => setCreator(data.name));
  };

  const [creator, setCreator] = useState(userInfo() ?? "undefined");
  const [community, setCommunity] = useState("Undefined");

  useEffect(() => {
    props.getCommunities();
  }, []);

  const registerPost = (event) => {
    event.preventDefault();
    const post = {
      title: title,
      message: message,
      creator: creator,
      community: community,
    };
    props.createPost(post);
    window.location.reload();
  };

  const onTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const onCommunityClick = (id) => {
    setCommunity(id);
  };

  return (
    <div
      className={`modal ${props.show ? "show" : ""}`}
      onClick={props.onClose}
    >
      <div className="modalWrap" onClick={(e) => e.stopPropagation()}>
        <Paper>
          <br />
          <h1>Add Post</h1>
          <form onSubmit={registerPost}>
            <input
              onChange={onTitleChange}
              type="text"
              name="title"
              placeholder="Title"
            />
            <br />
            <textarea
              onChange={onMessageChange}
              type="text"
              name="message"
              placeholder="Message"
            />
            <br />
            <p>Choose a Community:</p>
            {props.communities.map((community) => (
              <div key={community._id}>
                <Button onClick={() => onCommunityClick(community._id)}>
                  {community.title}{" "}
                </Button>
              </div>
            ))}
            <input type="submit" value="Submit" id="submit" />
          </form>
          <br />
        </Paper>
        <br />
        <br />
      </div>
    </div>
  );
};

CreatePost.propTypes = {
  getCommunities: PropTypes.func.isRequired,
  communities: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  communities: state.communities.items,
});

export default connect(mapStateToProps, { getCommunities, createPost })(
  CreatePost
);

// class CreatePost extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//           title: '',
//           message: '',
//           creator: this.userInfo(),
//           community: '',
//         };
//         this.registerPost = this.registerPost.bind(this);
//         this.userInfo = this.userInfo.bind(this);
//         this.onChange = this.onChange.bind(this);
//         this.setCommunity = this.setCommunity.bind(this);

//     }
//     registerPost(event) {
//         event.preventDefault();
//         const post = {
//             title: this.state.title,
//             message: this.state.message,
//             creator: this.state.creator,
//             community: this.state.community,
//         };
//         console.log(post)
//         this.props.createPost(post);
//         window.location.reload()
//       }

//       onChange(event){
//           event.preventDefault();

//           this.setState({[event.target.name]: event.target.value})
//       }

//       userInfo() {

//          fetch(`${process.env.API_REF}/profile`, {
//             headers: {
//                 'x-access-token': localStorage.getItem('token'),
//             },
//         })

//         .then(res => res.json())
//          .then(data => this.state.creator = data.name);

//     }
//     componentDidMount(){
//         this.props.getCommunities();
//     }

//     setCommunity(id){
//         console.log('clicked' + id)
//         this.setState({community: id})
//         console.log(this.state.community + this.state.message)
//     }

//     render(){
//         // const communityItems = this.props.communities.map(community => (
//         //     <div key={community._id}>
//         //        <Button onClick={this.setCommunity(community._id)}>{community.title} </Button>

//         //     </div>
//         // ))
//      return (
//          <div className={`modal ${this.props.show ? 'show' : ''}`} onClick={this.props.onClose}>
//              <div className='modalWrap' onClick={e => e.stopPropagation()}>
//                  <Paper  >
//                 <br />
//                 <h1>Add Post</h1>
//                 <form onSubmit={this.registerPost}>
//                     <input

//                         onChange={this.onChange}
//                         type='text'
//                         name='title'
//                         placeholder='Title'
//                     />
//                     <br/>
//                     <textarea

//                         onChange={this.onChange}
//                         type='text'
//                         name='message'
//                         placeholder='Message'
//                     />
//                     <br/>
//                     <p>Choose a Community:</p>
//                     { this.props.communities.map(community => (
//                         <div key={community._id}>
//                         <Button onClick={() => this.setCommunity(community._id)}>{community.title} </Button>

//                         </div>))}
//                     <input type='submit' value='Submit' id='submit' />
//                 </form>

//                 <br/>

//                 </Paper>
//                 <br />
//                 <br />
//             </div>
//          </div>
//      )
//  }
// }

// CreatePost.propTypes = {
//     getCommunities: PropTypes.func.isRequired,
//     communities: PropTypes.array.isRequired
// }

// const mapStateToProps = state => ({
//     communities: state.communities.items

// });

//  export default connect(mapStateToProps, { getCommunities, createPost })(CreatePost);

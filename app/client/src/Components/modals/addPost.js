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

//here

 import React, { Component, useEffect, useState } from 'react'
 import jwt_decode from "jwt-decode";
 import { renderMatches, useNavigate, Link } from 'react-router-dom';
 import { useDispatch } from 'react-redux';
 import { createPost } from '../../actions/postActions';
 import './addPost.css'
 import Paper from '@mui/material/Paper';
 import ChooseCommunities from '../communityAutoComplete'
 import { connect } from 'react-redux';
 import { getCommunities } from '../../actions/communityActons';
 import PropTypes from 'prop-types';
import { Button } from '@mui/material';



class CreatePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
          title: '',
          message: '',
          creator: this.userInfo(),
          community: '',
        };
        this.registerPost = this.registerPost.bind(this);
        this.userInfo = this.userInfo.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setCommunity = this.setCommunity.bind(this);

    }
    registerPost(event) {
        event.preventDefault();
        const post = {
            title: this.state.title, 
            message: this.state.message,
            creator: this.state.creator,
            community: this.state.community,
        };
        console.log(post)
        this.props.createPost(post);
       // window.location.reload() 
       // navigate('/posts')
      }

      onChange(event){
          event.preventDefault();

          this.setState({[event.target.name]: event.target.value})
      }

     



      userInfo() {
        
         fetch('http://localhost:5000/api/profile', {
            headers: {
                'x-access-token': localStorage.getItem('token'),
            },
        })

        .then(res => res.json())
         .then(data => this.state.creator = data.name);
      
       
    }
    componentDidMount(){
        this.props.getCommunities();
    }

    //   useEffect(() => {
    //     const token = localStorage.getItem('token')
    //     if (token){
    //         const user = jwt_decode(token)
    //         if(!user){
    //             localStorage.removeItem('token')
    //             navigate('/login')
    //         }else{
    //             userInfo();
                
    //         }
    //     }
    // }, [])
    setCommunity(id){
        console.log('clicked' + id)
        this.setState({community: id})
        console.log(this.state.community + this.state.message)
    }

    render(){
        // const communityItems = this.props.communities.map(community => (
        //     <div key={community._id}>
        //        <Button onClick={this.setCommunity(community._id)}>{community.title} </Button>
               
        //     </div>
        // ))
     return (
         <div className={`modal ${this.props.show ? 'show' : ''}`} onClick={this.props.onClose}>
             <div className='modalWrap' onClick={e => e.stopPropagation()}>
                 <Paper  >
                <br />
                <h1>Add Post</h1>
                <form onSubmit={this.registerPost}>
                    <input 
                        
                        onChange={this.onChange}
                        type='text'
                        name='title'
                        placeholder='Title'
                    />
                    <br/>
                    <textarea 
                        
                        onChange={this.onChange}
                        type='text'
                        name='message'
                        placeholder='Message'
                    />
                    <br/>
                 
                    <input type='submit' value='Submit' id='submit' />
                </form>
                
                <br/>
                { this.props.communities.map(community => (
            <div key={community._id}>
               <Button onClick={() => this.setCommunity(community._id)}>{community.title} </Button>
               
            </div>))}
                </Paper>
            </div> 
         </div>	
     )
 }
}

CreatePost.propTypes = {
    getCommunities: PropTypes.func.isRequired, 
    communities: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
    communities: state.communities.items 

});

 export default connect(mapStateToProps, { getCommunities, createPost })(CreatePost);
//  const CreatePost = (props) => {

    
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [title, setTitle] = useState('');
//     const [message, setMessage] = useState('');
//     const [name, setName] = useState('');
    
//     async function registerPost(event) {
//         event.preventDefault();
//         const post = {
//             title: title, 
//             message: message,
//             creator: name
//         };
//         dispatch(createPost(post));
//         window.location.reload() 
//        // navigate('/posts')
//       }

//       async function userInfo() {

//         const req = await fetch('http://localhost:5000/api/profile', {
//             headers: {
//                 'x-access-token': localStorage.getItem('token'),
//             },
//         })

//         const data = await req.json()
//         if(data.status === 'ok'){
//             setName(data.name)
//         }else{
//             alert(data.error)
//         }
//     }

//       useEffect(() => {
//         const token = localStorage.getItem('token')
//         if (token){
//             const user = jwt_decode(token)
//             if(!user){
//                 localStorage.removeItem('token')
//                 navigate('/login')
//             }else{
//                 userInfo();
                
//             }
//         }
//     }, [])

    
//      return (
//          <div className={`modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
//              <div className='modalWrap' onClick={e => e.stopPropagation()}>
//                  <Paper  >
//                 <br />
//                 <h1>Add Post</h1>
//                 <form onSubmit={registerPost}>
//                     <input 
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         type='text'
//                         placeholder='Title'
//                     />
//                     <br/>
//                     <textarea 
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                         type='text'
//                         placeholder='Message'
//                     />
//                     <br/>
//                     <ChooseCommunities />
//                     <input type='submit' value='Submit' id='submit' />
//                 </form>
//                 <br/>
//                 </Paper>
//             </div> 
//          </div>	
//      )
//  }
 
//  export default CreatePost;
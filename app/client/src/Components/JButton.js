import Button from "@mui/material/Button";
import React, { Component } from 'react'
 import jwt_decode from "jwt-decode";
// import { ThemeProvider, createTheme } from '@mui/material/styles';
 import { red, green } from '@mui/material/colors';

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#f44336',
//     },
//     secondary: {
//       main: green[600],
//     },
//   },
// });


class JoinButton extends Component{
  //_isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      communitiesList: ''
    };

    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount(){
    //this._isMounted = true;

    const token = localStorage.getItem('token')
    if (token){
      const user = jwt_decode(token)
      if(!user){
          localStorage.removeItem('token')
          
      }else{
        fetch('http://localhost:5000/api/communitiesList', {
           headers: {
            'x-access-token': localStorage.getItem('token'),
          },
          
        }) 
        .then (res => res.json())
        .then( data => {
          this.state.communitiesList = data.communities
          
          if((this.state.communitiesList[0]).includes(this.props.name)){ 
            this.setState({flag: true});
            
           }else{    
             this.setState({flag: false}) 
           }
        })
      }
    }
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
}

  handleClick () {
    if (this._isMounted){
    this.setState({flag: !this.state.flag});
    if(!this.state.flag){
        fetch('http://localhost:5000/api/communitiesList', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
             'x-access-token': localStorage.getItem('token'),
         },
         body: JSON.stringify({
             community: this.props.name,
         }),
      }) 
       
     }else{
       fetch( `http://localhost:5000/api/communitiesList/${this.props.name}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token'),
        },
     }) 
     }
    }
  };

    render(){
      
        return (
            
           <Button
             
             onClick={this.handleClick}
             variant="contained"
             color={this.state.flag === true ? 'error' : 'success' }
             size="small"
           >
             {this.state.flag? "Remove" : "Join"}
           </Button>
           
         );
    }

}export default JoinButton;

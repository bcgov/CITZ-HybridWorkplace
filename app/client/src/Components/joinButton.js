import Button from "@mui/material/Button";
import React, { useEffect, useState } from 'react'
 import jwt_decode from "jwt-decode";
 import { Link, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { red, green } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f44336',
    },
    secondary: {
      main: green[600],
    },
  },
});


const JoinButton = ({name}) => {
 const [flag, setFlag] = useState('');
 const [[communitiesList], setCommunitiesList] = useState('');

  function populateArray(){
  // const req = await fetch('http://localhost:5000/api/communitiesList', {
  //     headers: {
  //         'x-access-token': localStorage.getItem('token'),
  //     },
  // })

  // const data = await req.json()
  // if(data.status === 'ok'){
  //     setCommunitiesList(data.communities)
  //     if(communitiesList.includes(name)){ 
  //                 setFlag(true);
  //                }else{   
  //                  setFlag(false)     
  //                }
  //     console.log(communitiesList)
  // }else{
  //     alert(data.error)
  // }
  fetch('http://localhost:5000/api/communitiesList', {
           headers: {
            'x-access-token': localStorage.getItem('token'),
          },
          
        })
        .then (res => res.json())
        .then( data => {
          setCommunitiesList(data.communities)
          console.log('helllloooo')
          if(communitiesList && communitiesList.includes(name)){ 
            setFlag(true);
            
           }else{   
             setFlag(false)
                 
           }
        })
        

}

 const navigate = useNavigate();
 async function handleClick () {
   setFlag(!flag);
   if(!flag){
      const req = await fetch('http://localhost:5000/api/communitiesList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
            community: name,
        }),
     }) 
       const data = await req.json() 
            if(data.status === 'ok'){
                console.log(data)
            }else{ 
                alert(data.error)
            }
    }
 };


  useEffect(() => {
  const token = localStorage.getItem('token')
  if (token){
      const user = jwt_decode(token)
      if(!user){
          localStorage.removeItem('token')
          navigate('/login')
      }else{
         populateArray()
      }
        
        // .then( communitiesList => {
          

        //   })
      }
  
 }, [])

 return (
    <ThemeProvider theme={theme}>
   <Button 
     onClick={handleClick}
     variant="contained"
     color={flag ? "primary" : 'secondary' }
     size="small"
   >
     {flag? "Remove" : "Join"}
   </Button>
   </ThemeProvider>
 );
}
export default JoinButton;
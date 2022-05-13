import Button from "@mui/material/Button";
import React, { useEffect, useState } from 'react'
import jwt_decode from "jwt-decode";
// import { ThemeProvider, createTheme } from '@mui/material/styles';
//import { red, green } from '@mui/material/colors';

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

const JoinButton = (props) => {
  const [flag, setFlag] = useState(false)
  const [communitiesList, setCommunitiesList] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const user = jwt_decode(token)
      if (!user) {
        localStorage.removeItem('token')
      } else {
        fetch(`${process.env.API_REF}/communitiesList`,
          {
            headers: {
              'x-access-token': localStorage.getItem('token'),
            },
          }).then(res => res.json())
          .then(data => {
            setCommunitiesList(data.communities)
            if ((communitiesList[0]).includes(props.name)) {
              setFlag(true)

            } else {
              setFlag(false)
            }
          })
      }
    }
  }, [])

  const handleClick = () => {

    setFlag(!flag)

    if (!flag) {
      fetch(`${process.env.API_REF}/communitiesList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
          community: props.name,
        }),
      })
    } else {
      fetch(`${window._env_.API_REF}/communitiesList/${props.name}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token'),
        },
      })
    }
  }

  return (
    <Button
      onClick={handleClick}
      variant="contained"
      color={flag === true ? 'error' : 'success'}
      size="small"
    >
      {flag ? "Remove" : "Join"}
    </Button>
  )
}

export default JoinButton

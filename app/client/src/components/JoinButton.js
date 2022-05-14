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

import Button from "@mui/material/Button";
import React, { useEffect, useState } from 'react';

//import { ThemeProvider, createTheme } from '@mui/material/styles';
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
  const [flag, setFlag] = useState(false);
  const [communitiesList, setCommunitiesList] = useState([]);

  useEffect(() => {
    //const token = localStorage.getItem('token');
    //if (token) {
      //const user = jwt_decode(token)
      //if (!user) {
        //localStorage.removeItem('token')
      //} else {
        fetch(`${process.env.API_REF}/community`,
          {
            headers: {
              //'x-access-token': localStorage.getItem('token'),
            },
          }).then(res => res.json())
          .then(data => {
            setCommunitiesList(data.communities);
            if ((communitiesList[0]).includes(props.name)) {
              setFlag(true);
            } else {
              setFlag(false);
            }
          })
      //}
    //}
  }, []);

  const handleClick = () => {

    setFlag(!flag)

    if (!flag) {
      //FIX ME: SET JOIN IN COMMUNITY > MEMBERS, and PROFILE > COMMUNITIES
      /*
      fetch(`${process.env.API_REF}/community`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //'x-access-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
          community: props.title,
        }),
      });
      */
    } else {
      //FIX ME: SET LEAVE COMMUNITY IN COMMUNITY > MEMBERS, and PROFILE > COMMUNITIES
      /*
      fetch(`${window._env_.API_REF}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          //'x-access-token': localStorage.getItem('token'),
        },
        body: {
          communities: [
            {}
          ]
        },
      });
      */
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
  );
}

export default JoinButton;

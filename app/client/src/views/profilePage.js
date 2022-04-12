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
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import UserPic from '../layout/icons/user.png'
import './Styles/profile.css'
import ProfileInfo from '../Components/profileInfo'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Communities from '../Components/joinCommunitiesList'

const Profile = () => {
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'left',
        color: theme.palette.text.secondary,
    }))
    return (
        <Box sx={{ alignItems: 'stretch' }}>
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <img src={UserPic} id="ProfilePic" alt="Profile" />
                    <ProfileInfo />
                    <br />
                    <br />
                    <Link to="./edit" style={{ textDecoration: 'none' }}>
                        <Box
                            sx={{
                                backgroundColor: '#036',
                                color: 'white',
                                px: 1,
                                py: 0.5,
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant="h6" component="p">
                                Edit Profile
                            </Typography>
                        </Box>
                    </Link>
                </Grid>
                <Grid item xs={6}>
                    <Paper elevation={0}>
                        <Box
                            sx={{
                                backgroundColor: '#036',
                                color: 'white',
                                px: 1,
                                py: 0.5,
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant="h6" component="h5">
                                Posts
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Box
                        sx={{
                            backgroundColor: '#036',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h6" component="h5">
                            My Communities
                        </Typography>
                    </Box>
                    <Communities />
                </Grid>
            </Grid>
        </Box>
    )
}
export default Profile

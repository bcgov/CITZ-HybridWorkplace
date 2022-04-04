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
import jwt_decode from "jwt-decode";
import { Link, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Communities from '../Components/joinCommunitiesList'
import Typography from '@mui/material/Typography'

const Home = () => {
	const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token){
            const user = jwt_decode(token)
            if(!user){
                localStorage.removeItem('token')
                navigate('/login')
            }
        }
    }, [])


	return (
		<div>
            <Grid container spacing={2}>
                
                <Grid item xs={8}>
                    <Paper>
                    <Box
                            sx={{
                                backgroundColor: '#036',
                                color: 'white',
                                px: 1,
                                py: 0.5,
                                textAlign: 'center',
                            }}
                        >
                        <Typography variant='h6' component='h5'>Posts</Typography>
                    
                        </Box>
                        <p>To be implimented later</p>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper>
                        <Box
                            sx={{
                                backgroundColor: '#036',
                                color: 'white',
                                px: 1,
                                py: 0.5,
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant='h6' component='h5'>Communities</Typography>

                        </Box>
                        <Communities />
                        <Link to='/createCommunity' style={{ textDecoration: 'none' }}>
                        <Box
                            sx={{
                                backgroundColor: '#036',
                                color: 'white',
                                px: 1,
                                py: 0.5,
                                textAlign: 'center',
                                
                            }}
                        >
                            <Typography variant='h6' component='h5'>+ Create Community</Typography>
                            
                            

                        </Box>
                        </Link>
                    </Paper>
                </Grid>
            </Grid>
            
 
        </div>	
	)
}

export default Home
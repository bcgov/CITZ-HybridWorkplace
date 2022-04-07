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

 const express = require('express')
 const app = express()

 const port = process.env.PORT || 5000;
 const cors = require('cors')
 const mongoose = require('mongoose')

 
 const registerRouter = require('./routes/register')
 const loginRouter = require('./routes/login')
 const profileRouter = require('./routes/profile')
 const editProfileRouter = require('./routes/editProfile')
 const communitiesRouter = require('./routes/communities')
 const communitiesListRouter = require('./routes/communitiesListRouter')
 const logoutRouter = require('./routes/logout')
 const postRouter = require('./routes/posts')
 
  app.use(cors()) //middleware
  app.use(express.json())
 

const mongodb_url = encodeURIComponent(process.env.MONGODB_URI)
const mongodb_main = process.env.MONGODB_DB_MAIN
mongoose.connect("mongodb://"+mongodb_url+mongodb_main)

 app.use("/api/register", registerRouter);
 app.use('/api/login', loginRouter);
 app.use('/api/profile', profileRouter);
 app.use('/api/editProfile', editProfileRouter);
 app.use('/api/community', communitiesRouter);
 app.use('/api/communitiesList', communitiesListRouter);
 app.use('/api/logout', logoutRouter);
 app.use('/api/post', postRouter);
 

 app.listen(port, () => {
     console.log(`Server started on port ${port}`)
<<<<<<< HEAD
 })



=======
 })
>>>>>>> 9fbf953 (fix)

// mongodb connection via mongoose
const db = require('./db.js');

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// route imports
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const profileRouter = require('./routes/profile');
const editProfileRouter = require('./routes/editProfile');
const communitiesRouter = require('./routes/communities');
const communitiesListRouter = require('./routes/communitiesListRouter');
const logoutRouter = require('./routes/logout');
const postRouter = require('./routes/posts');
const apiMonitoringRouter = require('./routes/apiMonitoring');
 
const app = express(); 
 
// Express middleware 
app.use(express.json());
app.use(cors()); 
app.use(rateLimit());
 
// Routing 
app.get('/', (req, res) => { 
  res.send('Node.js Server is live!'); 
}); 

// Routes
app.use("/api/register", registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/profile', profileRouter);
app.use('/api/editProfile', editProfileRouter);
app.use('/api/community', communitiesRouter);
app.use('/api/communitiesList', communitiesListRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/post', postRouter);
app.use('/api/health', apiMonitoringRouter);
 
module.exports = app;

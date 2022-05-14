// mongodb connection via mongoose
const db = require('./db.js');

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// route imports
const communityRouter = require('./routes/community');
const postRouter = require('./routes/post');
const profileRouter = require('./routes/profile');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const healthCheckRouter = require('./routes/healthCheck');

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
app.use('/api/community', communityRouter);
app.use('/api/post', postRouter);
app.use('/api/profile', profileRouter);
app.use("/api/register", registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/health', healthCheckRouter);

module.exports = app;

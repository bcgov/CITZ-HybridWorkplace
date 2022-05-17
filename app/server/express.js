// mongodb connection via mongoose
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
require("./db");

// route imports
const communityRouter = require("./routes/community");
const postRouter = require("./routes/post");
const profileRouter = require("./routes/profile");
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const healthCheckRouter = require("./routes/healthCheck");
const tokenRouter = require("./routes/token");

const authenticateToken = require("./middleware/authenticateToken");

const app = express();

// Express middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per `window`
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);

// Routing
app.get("/", (req, res) => res.send("Node.js Server is live!"));

// Routes
app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/token", tokenRouter);

// Authenticate following routes
app.use(authenticateToken);

app.use("/api/community", communityRouter);
app.use("/api/post", postRouter);
app.use("/api/profile", profileRouter);
app.use("/api/health", healthCheckRouter);

module.exports = app;

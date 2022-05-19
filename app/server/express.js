// mongodb connection via mongoose
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
require("./db");

// Version 1 route imports
const communityRouterV1 = require("./routes/v1/community");
const postRouterV1 = require("./routes/v1/post");
const profileRouterV1 = require("./routes/v1/profile");
const registerRouterV1 = require("./routes/v1/register");
const loginRouterV1 = require("./routes/v1/login");
const logoutRouterV1 = require("./routes/v1/logout");
const healthCheckRouterV1 = require("./routes/v1/healthCheck");
const tokenRouterV1 = require("./routes/v1/token");

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

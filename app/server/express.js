// mongodb connection via mongoose
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routesVersioning = require("express-routes-versioning")();
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

// Versioning
app.use((req, res, next) => {
  if (process.env.API_VERSION !== "") {
    req.version = `${process.env.API_VERSION}.0.0`;
  }
  next();
});

function NoMatchFoundCallback(req, res) {
  res.status(404).send("Version not found.");
}

// Version 1 routes
function useV1(req, res, next) {
  // Routes
  app.use("/api/register", registerRouterV1);
  app.use("/api/login", loginRouterV1);
  app.use("/api/logout", logoutRouterV1);
  app.use("/api/token", tokenRouterV1);

  app.use("/api/community", authenticateToken, communityRouterV1);
  app.use("/api/post", authenticateToken, postRouterV1);
  app.use("/api/profile", authenticateToken, profileRouterV1);
  app.use("/api/health", authenticateToken, healthCheckRouterV1);

  next();
}

// Route to version
app.use(
  "/api",
  routesVersioning(
    {
      // prettier-ignore
      "1.0.0": useV1,
    },
    NoMatchFoundCallback
  )
);

module.exports = app;

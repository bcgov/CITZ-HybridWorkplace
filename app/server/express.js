// mongodb connection via mongoose
require("./db");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routesVersioning = require("express-routes-versioning")();
const rateLimit = require("express-rate-limit");
const authenticateToken = require("./middleware/authenticateToken");
const sanitizeInputs = require("./middleware/sanitizeInputs");

const swaggerUI = require("swagger-ui-express");
const swaggerConf = require("./swagger-conf");

// Version 1 route imports
const communityRouterV1 = require("./routes/v1/community/community");
const communityFlagsRouterV1 = require("./routes/v1/community/communityFlags");
const communityTagsRouterV1 = require("./routes/v1/community/communityTags");
const communityRulesRouterV1 = require("./routes/v1/community/communityRules");
const communityMembersRouterV1 = require("./routes/v1/community/communityMembers");

const postRouterV1 = require("./routes/v1/post/post");
const postFlagsRouterV1 = require("./routes/v1/post/postFlags");
const postTagsRouterV1 = require("./routes/v1/post/postTags");

const commentRouterV1 = require("./routes/v1/comment/comment");
const commentReplyRouterV1 = require("./routes/v1/comment/commentReply");
const commentVoteRouterV1 = require("./routes/v1/comment/commentVoting");

const userRouterV1 = require("./routes/v1/user");

const registerRouterV1 = require("./routes/v1/register");
const loginRouterV1 = require("./routes/v1/login");
const logoutRouterV1 = require("./routes/v1/logout");
const healthCheckRouterV1 = require("./routes/v1/healthCheck");
const tokenRouterV1 = require("./routes/v1/token");

const app = express();

app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerConf.specs, swaggerConf.uiOptions)
);

// Cors origin
const corsOrigin = !process.env.REACT_APP_LOCAL_DEV
  ? process.env.FRONTEND_REF
  : `http://${process.env.FRONTEND_REF}:${process.env.FRONTEND_PORT}`;

// Express middleware
app.use(express.json());
// TODO: Remove hard-coding, set env variable for openshift
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per `window`
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);
app.use(sanitizeInputs);

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
  app.use("/api/health", healthCheckRouterV1);

  app.use("/api/community", authenticateToken, communityRouterV1);
  app.use("/api/community/flags", authenticateToken, communityFlagsRouterV1);
  app.use("/api/community/tags", authenticateToken, communityTagsRouterV1);
  app.use("/api/community/rules", authenticateToken, communityRulesRouterV1);
  app.use(
    "/api/community/members",
    authenticateToken,
    communityMembersRouterV1
  );

  app.use("/api/post", authenticateToken, postRouterV1);
  app.use("/api/post/flags", authenticateToken, postFlagsRouterV1);
  app.use("/api/post/tags", authenticateToken, postTagsRouterV1);

  app.use("/api/comment", authenticateToken, commentRouterV1);
  app.use("/api/comment/reply", authenticateToken, commentReplyRouterV1);
  app.use("/api/comment/vote", authenticateToken, commentVoteRouterV1);

  app.use("/api/user", authenticateToken, userRouterV1);

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

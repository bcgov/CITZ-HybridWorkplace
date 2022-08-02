/* eslint-disable import/no-dynamic-require */
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
 * @author [Brady Mitchell](braden.jr.mitch@gmail.com)
 * @module
 */

// mongodb connection via mongoose
require("./db");

const express = require("express");

// Middleware imports
const initLogger = require(`./versions/v${process.env.API_VERSION}/middleware/initLogger`);
const authenticateToken = require(`./versions/v${process.env.API_VERSION}/middleware/authenticateToken`);
const sanitizeInputs = require(`./versions/v${process.env.API_VERSION}/middleware/sanitizeInputs`);
const requestFinally = require(`./versions/v${process.env.API_VERSION}/middleware/requestFinally`);
const setOnlineStatus = require(`./versions/v${process.env.API_VERSION}/middleware/setOnlineStatus`);
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const Keycloak = require("keycloak-connect");
const session = require("express-session");

const swaggerConf = require(`./swagger/conf`);
const swaggerUI = require("swagger-ui-express");

// Route imports
const {
  communityRouter,
  communityFlagsRouter,
  communityTagsRouter,
  communityRulesRouter,
  communityMembersRouter,
  communityModeratorsRouter,
  postRouter,
  postFlagsRouter,
  postTagsRouter,
  commentRouter,
  commentReplyRouter,
  commentVoteRouter,
  commentFlagsRouter,
  userRouter,
  registerRouter,
  loginRouter,
  logoutRouter,
  healthCheckRouter,
  tokenRouter,
  searchRouter,
  onlineStatusRouter,
  adminRouter,
} = require(`./versions/v${process.env.API_VERSION}/routes/routeImports`);

const keycloakRouter = require(`./versions/v${process.env.API_VERSION}/routes/keycloakLogin`);

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
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 15 * 1000, // 15 seconds
    max: 100, // Limit each IP to 100 requests per `window`
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);
app.use(sanitizeInputs);

// FEATURE_TOGGLE=KEYCLOAK_AUTH_FEATURE
if (process.env.TOGGLE_KEYCLOAK_AUTH === "true") {
  const memoryStore = new session.MemoryStore();
  app.use(
    session({
      secret: "some secret",
      resave: false,
      saveUninitialized: true,
      store: memoryStore,
    })
  );
  const keycloak = new Keycloak(
    { store: memoryStore, idpHint: "idir" },
    {
      "confidential-port": process.env.CONFIDENTIAL_PORT,
      "auth-server-url": process.env.AUTH_SERVER_URL,
      realm: process.env.REALM,
      "ssl-required": process.env.SSL_REQUIRED,
      resource: process.env.RESOURCE,
      credentials: {
        secret: process.env.KEYCLOAK_CLIENT_SECRET,
      },
    }
  );
  app.use(keycloak.middleware());
  app.use("/api/keycloakLogin", initLogger, keycloak.protect(), keycloakRouter);

  exports.memoryStore = memoryStore;
}

// Routing
app.get("/", (req, res) => res.send("Node.js Server is live!"));
app.use("/api/health", healthCheckRouter);

app.use("/api/register", initLogger, registerRouter, requestFinally);
app.use("/api/login", initLogger, loginRouter, requestFinally);
app.use("/api/logout", initLogger, logoutRouter, requestFinally);
app.use("/api/token", initLogger, tokenRouter, requestFinally);

app.use(
  "/api/search",
  initLogger,
  authenticateToken,
  searchRouter,
  setOnlineStatus,
  requestFinally
);

app.use(
  "/api/online",
  initLogger,
  authenticateToken,
  onlineStatusRouter,
  requestFinally
);

app.use(
  "/api/admin",
  initLogger,
  authenticateToken,
  adminRouter,
  requestFinally
);

app.use(
  "/api/community/moderators",
  initLogger,
  authenticateToken,
  communityModeratorsRouter,
  setOnlineStatus,
  requestFinally
);

app.use(
  "/api/community/flags",
  initLogger,
  authenticateToken,
  communityFlagsRouter,
  setOnlineStatus,
  requestFinally
);
app.use(
  "/api/community/tags",
  initLogger,
  authenticateToken,
  communityTagsRouter,
  setOnlineStatus,
  requestFinally
);
app.use(
  "/api/community/rules",
  initLogger,
  authenticateToken,
  communityRulesRouter,
  setOnlineStatus,
  requestFinally
);
app.use(
  "/api/community/members",
  initLogger,
  authenticateToken,
  communityMembersRouter,
  setOnlineStatus,
  requestFinally
);

app.use(
  "/api/community",
  initLogger,
  authenticateToken,
  communityRouter,
  setOnlineStatus,
  requestFinally
);

app.use(
  "/api/post/flags",
  initLogger,
  authenticateToken,
  postFlagsRouter,
  setOnlineStatus,
  requestFinally
);
app.use(
  "/api/post/tags",
  initLogger,
  authenticateToken,
  postTagsRouter,
  setOnlineStatus,
  requestFinally
);
app.use(
  "/api/post",
  initLogger,
  authenticateToken,
  postRouter,
  setOnlineStatus,
  requestFinally
);

app.use(
  "/api/comment/reply",
  initLogger,
  authenticateToken,
  commentReplyRouter,
  setOnlineStatus,
  requestFinally
);
app.use(
  "/api/comment/vote",
  initLogger,
  authenticateToken,
  commentVoteRouter,
  setOnlineStatus,
  requestFinally
);
app.use(
  "/api/comment/flags",
  initLogger,
  authenticateToken,
  commentFlagsRouter,
  setOnlineStatus,
  requestFinally
);
app.use(
  "/api/comment",
  initLogger,
  authenticateToken,
  commentRouter,
  setOnlineStatus,
  requestFinally
);

app.use(
  "/api/user",
  initLogger,
  authenticateToken,
  userRouter,
  setOnlineStatus,
  requestFinally
);

module.exports = app;

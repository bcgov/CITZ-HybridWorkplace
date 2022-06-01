// mongodb connection via mongoose
require("./db");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routesVersioning = require("express-routes-versioning")();
const rateLimit = require("express-rate-limit");

const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

// Version 1 route imports
const communityRouterV1 = require("./routes/v1/community/community");
const communityFlagsRouterV1 = require("./routes/v1/community/communityFlags");
const communityTagsRouterV1 = require("./routes/v1/community/communityTags");
const communityRulesRouterV1 = require("./routes/v1/community/communityRules");
const postRouterV1 = require("./routes/v1/post/post");
const postFlagsRouterV1 = require("./routes/v1/post/postFlags");
const postTagsRouterV1 = require("./routes/v1/post/postTags");
const userRouterV1 = require("./routes/v1/user");
const registerRouterV1 = require("./routes/v1/register");
const loginRouterV1 = require("./routes/v1/login");
const logoutRouterV1 = require("./routes/v1/logout");
const healthCheckRouterV1 = require("./routes/v1/healthCheck");
const tokenRouterV1 = require("./routes/v1/token");

const authenticateToken = require("./middleware/authenticateToken");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CITZ HybridWorkplace",
      version: process.env.API_VERSION || "undefined",
      description: `### API Documentation
      \n\n**This API uses JWT tokens for authentication. Steps to auth:**
      \n\n- **Log in**, copy the access token from the response. Click on one of the **lock icons** to the right of some endpoints. Paste the token into the field and click **'Authorize'**. 
      \n\n- Now you will have limited access, as the token will expire. When token expires requests will return a **403: Invalid Token** response. 
      \n\n- When this happens, use the **/token** endpoint. Copy the access token in the response. Paste it into the field in the lock icon and click **'Authorize'**.`,
    },
    tags: [
      {
        name: "API",
      },
      {
        name: "Auth",
        description: "Login, logout, register, and refresh access token.",
      },
      {
        name: "Community",
        description: "View, create, edit, and delete communities.",
      },
      {
        name: "Community Rules",
        description: "View and edit community rules.",
      },
      {
        name: "Community Tags",
        description: "View and edit community tags.",
      },
      {
        name: "Community Flags",
        description: "View, set, and unset community flags.",
      },
      {
        name: "Post",
        description: "View, create, edit, and delete posts.",
      },
      {
        name: "Post Tags",
        description: "View, tag, and untag posts.",
      },
      {
        name: "Post Flags",
        description: "View, set, and unset post flags.",
      },
      {
        name: "User",
        description: "View and edit user settings.",
      },
    ],
  },
  apis: [
    `${__dirname}/express.js`,
    `${__dirname}/routes/v${process.env.API_VERSION}/*.js`,
    `${__dirname}/routes/v${process.env.API_VERSION}/community/*.js`,
    `${__dirname}/routes/v${process.env.API_VERSION}/post/*.js`,
    `${__dirname}/models/*.js`,
  ],
};

const specs = swaggerJsDoc(swaggerOptions);

const uiOptions = {
  customSiteTitle: "HWP Swagger Docs",
  customCss: `
  .topbar-wrapper img {content:url(https://www2.gov.bc.ca/StaticWebResources/static/gov3/images/gov_bc_logo.svg); width:190px; height:auto;}
  .swagger-ui .topbar { background-color: #234075; border-bottom: 2px solid #e3a82b; }`,
};

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs, uiOptions));

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

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

  app.use("/api/post", authenticateToken, postRouterV1);
  app.use("/api/post/flags", authenticateToken, postFlagsRouterV1);
  app.use("/api/post/tags", authenticateToken, postTagsRouterV1);

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

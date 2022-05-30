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
const communityRouterV1 = require("./routes/v1/community");
const postRouterV1 = require("./routes/v1/post");
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
      description: `API Documentation
      \n\n## AUTH: 
      This API uses JWT tokens for authentication. Start by registering, or if you already have an account, logging in. 
      \n\n- After logging in, copy the access token from the response. 
      \n\n- Click on the **'Authorize'** button, paste the token into the field under **'bearerAuth'**, and click **'Authorize'**. 
      \n\n- Now you will have limited access to the endpoints that require authentication (indicated by a lock icon). 
      \n\n- You will not have any indication for when your token expires, except that requests will return a **'Forbidden'** response. 
      \n\n- When this happens, you will be required to use the token endpoint, copy the access token in the response, and paste it into the field under **'bearerAuth'**.`,
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
        name: "Post",
        description: "View, create, edit, and delete posts.",
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
    `${__dirname}/models/*.js`,
  ],
};

const specs = swaggerJsDoc(swaggerOptions);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

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
    origin: [
      "https://hwp-react-d63404-dev.apps.silver.devops.gov.bc.ca/",
      corsOrigin,
    ],
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
  app.use("/api/post", authenticateToken, postRouterV1);
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

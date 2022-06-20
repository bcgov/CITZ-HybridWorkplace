const swaggerJsDoc = require("swagger-jsdoc");

// Endpoints are grouped by tags in Swagger Docs
const tags = [
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
    name: "Community Members",
    description: "Join, leave, view members of communities.",
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
    name: "Comment",
    description: "View, create, edit, and delete comments.",
  },
  {
    name: "Comment Replies",
    description: "View replies and create replies.",
  },
  {
    name: "Comment Voting",
    description: "Upvote and downvote comments.",
  },
  {
    name: "Comment Flags",
    description: "View, set, and unset comment flags.",
  },
  {
    name: "User",
    description: "View and edit user settings.",
  },
];

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
    tags,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    `${__dirname}/express.js`,
    `${__dirname}/routes/v${process.env.API_VERSION}/*.js`,
    `${__dirname}/routes/v${process.env.API_VERSION}/*/*.js`,
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

module.exports = { specs, uiOptions };

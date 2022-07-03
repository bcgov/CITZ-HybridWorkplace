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

const swaggerJsDoc = require("swagger-jsdoc");
const tags = require("./tags");

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
    `${__dirname}/../express.js`,
    `${__dirname}/../versions/v${process.env.API_VERSION}/routes/*.js`,
    `${__dirname}/../versions/v${process.env.API_VERSION}/routes/*/*.js`,
    `${__dirname}/../versions/v${process.env.API_VERSION}/models/*.js`,
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

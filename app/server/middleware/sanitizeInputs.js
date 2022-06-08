/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
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

const asyncHandler = require("express-async-handler");

/**
 * Sanitizes the body and query of a request as middleware.
 * Removes '$' character to prevent injection attacks.
 * Does NOT work with req.params, BUT params are passed as a string
 * instead of an object so there should be no worries of injection.
 */
sanitize = (input) => {
  if (input instanceof Object) {
    Object.keys(input).forEach((key) => {
      if (/^\$/.test(key)) {
        delete input[key];
      } else {
        // Recursion for nested objects
        sanitize(input[key]);
      }
    });
  }
  return input;
};

const sanitizeInputs = asyncHandler(async (req, res, next) => {
  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  next();
});

module.exports = sanitizeInputs;

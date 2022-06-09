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

const ResponseError = require("../responseError");

/**
 * Given a list of blacklisted fields, check that the request body does
 * NOT include them. If it does, throw an error.
 */
const checkPatchQuery = (requestBody, document, blacklistedFields) => {
  // eslint-disable-next-line prefer-const
  let query = { $set: {} };

  Object.keys(requestBody).forEach((key) => {
    if (blacklistedFields.includes(key))
      throw new ResponseError(403, `${key} can not be edited.`);

    if (document[key] && document[key] !== requestBody[key]) {
      // Key exists in document and it's value is different from the request body
      query.$set[key] = requestBody[key];
    } else if (!document[key]) {
      // Key does not exist in document, so set it.
      // If field isn't in schema, it simply won't be set upon updating the document.
      query.$set[key] = requestBody[key];
    }
  });

  return query;
};

module.exports = checkPatchQuery;

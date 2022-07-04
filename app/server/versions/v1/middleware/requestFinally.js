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

const ResponseError = require("../classes/responseError");

/**
 * @description Final middleware of an API request.
 * Takes care of request errors and prints the log.
 */
const requestFinally = async (req, res) => {
  try {
    if (res.locals.err) {
      // Explicitly thrown error
      if (res.locals.err instanceof ResponseError) {
        req.log.setResponse(
          res.locals.err.status,
          "ResponseError",
          res.locals.err.message
        );
        return res.status(res.locals.err.status).send(res.locals.err.message);
      }
      // Bad Request
      req.log.setResponse(400, "Error", res.locals.err);
      return res.status(400).send(`Bad Request: ${res.locals.err}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    req.log.print();
  }
};

module.exports = requestFinally;

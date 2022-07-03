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

/**
 * @description Custom Error class to capture errors to api requests.
 * @param status Response status code (ex: 200, 201, 204, 400, 401, 403).
 * @param message Response error message (ex: "User not found.").
 */
class ResponseError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = ResponseError;

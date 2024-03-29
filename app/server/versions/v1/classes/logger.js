/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
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

const moment = require("moment");
const c = require("ansi-colors");

const enabled = process.env.ENABLE_API_REQUEST_LOGS === "true";

c.theme({
  error: c.red,
  success: c.greenBright,
  warn: c.yellow,
  duration: c.magenta,
  time: c.white,
});

// Mask fields that shouldn't be displayed in console.
const maskFields = [
  "username",
  "email",
  "password",
  "members",
  "creator",
  "refreshToken",
  "taggedBy",
  "flaggedBy",
  "users",
  "moderators",
];

const mask = (object) => {
  Object.keys(object).forEach((key) => {
    if (maskFields.includes(key)) {
      // Replace value with mask
      object[key] = "***";
    }
    if (object[key] instanceof Object) {
      // Recursion for nested objects
      mask(object[key]);
    }
  });
  return object;
};

/**
 * @description Creates a log for an API request to be displayed in console.
 */
class Logger {
  constructor(endpoint, method, requestBody) {
    this.endpoint = endpoint;
    this.method = method;
    this.requestBody = requestBody ? mask(requestBody) : {};
    this.getCurrentTime();
    this.startTime = Date.now();
    this.actions = [];
  }

  setResponse(status, level, error) {
    this.status = status;
    this.level = level;
    this.error = error;
  }

  addAction(actionDesc) {
    const action = { desc: actionDesc };
    action.timeSince = `${Math.floor(Date.now() - this.startTime)}ms`;
    this.actions.push(action);
  }

  addPatchQuery(query) {
    this.patchQuery = mask(query);
  }

  getCurrentTime() {
    // Check if Daylight savings time is in effect
    const date = new Date();
    const january = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
    const july = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    const dst = Math.max(january, july) !== date.getTimezoneOffset();

    // Set timezone and date/time
    if (dst === true) {
      this.timezone = "PST";
      this.pt = moment().utcOffset(-8).format("MMMM Do YYYY, h:mm:ss a");
    } else {
      this.timezone = "PDT";
      this.pt = moment().utcOffset(-7).format("MMMM Do YYYY, h:mm:ss a");
    }
    this.utc = moment().format("MMMM Do YYYY, h:mm:ss a");
  }

  generateLogMessage() {
    let msg = "";

    // Log level, method and endpoint
    switch (this.level) {
      case "Success":
        msg += c.bold.success(
          `${this.level} (${this.status}): [${this.method}] ${this.endpoint}`
        );
        break;
      case "ResponseError":
        if (this.actions.length > 0)
          this.actions[this.actions.length - 1].error = true;
        msg += c.bold.warn(
          `${this.level} (${this.status}): [${this.method}] ${this.endpoint}, `
        );
        msg += c.red(`"${this.error}"`);
        break;
      case "Error":
        if (this.actions.length > 0)
          this.actions[this.actions.length - 1].error = true;
        msg += c.bold.error(
          `${this.level} (${this.status}): [${this.method}] ${this.endpoint}, `
        );
        msg += c.red(`"${this.error}"`);
        break;
      default:
        msg += `${this.level} (${this.status}): [${this.method}] ${this.endpoint}`;
        break;
    }

    // Date and time
    msg += `, ${c.bold(`UTC`)}: ${this.utc}, ${c.bold(this.timezone)}: ${
      this.pt
    }, `;

    // Request body
    msg += `${c.bold(`Request Body`)}: ${JSON.stringify(this.requestBody)}, `;

    // Actions
    msg += `${c.bold(`Actions`)}: [`;
    Object.keys(this.actions).forEach((action) => {
      let actionStr = `"${this.actions[action].desc}" `;

      // Action time
      actionStr += c.time(`(time: ${this.actions[action].timeSince}), `);

      if (this.actions[action].error) {
        // Action failed
        msg += c.redBright(actionStr);
      } else {
        // Action succeeded
        msg += actionStr;
      }
    });
    msg += "]";

    // Patch query
    if (this.patchQuery)
      msg += `, ${c.bold(`Patch Query`)}: ${JSON.stringify(this.patchQuery)}`;

    this.message = msg;
  }

  print() {
    if (enabled) {
      this.generateLogMessage();
      this.duration = Math.floor(Date.now() - this.startTime);
      console.log(
        `${this.message}, ${c.bold(`Duration`)}: ${c.duration(
          `${this.duration}ms`
        )}`
      );
    }
  }
}

module.exports = Logger;

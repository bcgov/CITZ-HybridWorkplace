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
const Options = require("../models/options.model");

/**
 * @description The Options collecton stores values such as post title max length
 * or allowed values for notification frequency (ie. immediate, daily, monthly).
 * @param component grouping of options in the Options collection.
 * @returns the options for a given component.
 */
const getOptions = async (component) => {
  const options = await Options.findOne({ component });
  if (!options) throw new ResponseError(404, "Options not found.");
  return options.options;
};

module.exports = getOptions;

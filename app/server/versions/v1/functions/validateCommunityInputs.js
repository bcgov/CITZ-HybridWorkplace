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
const trimExtraSpaces = require("./trimExtraSpaces");

/**
 * @description Validates inputs for creating a post.
 * @returns Nothing, but will throw a ResponseError if an input is invalid.
 */
const validateCommunityInputs = (reqBody, options) => {
  const {
    titleMinLength,
    titleMaxLength,
    titleDisallowedCharacters,
    titleDisallowedStrings,
    descriptionMinLength,
    descriptionMaxLength,
    tagMinLength,
    tagMaxLength,
  } = options;

  // Validate title
  const titleRegexStr = `(?!.*[${titleDisallowedCharacters}]).{${titleMinLength},${titleMaxLength}}`;
  const titlePattern = new RegExp(titleRegexStr, "g");
  const titleDisallowedCharactersReplace = titleDisallowedCharacters
    .replace(/^\\/g, "x")
    .replaceAll("\\", "")
    .replace("x", "\\");
  const titleError = `title does not meet requirements: length ${titleMinLength}-${titleMaxLength}, must not contain characters (${titleDisallowedCharactersReplace}).`;
  if (!titlePattern.test(reqBody.title))
    throw new ResponseError(403, titleError);

  titleDisallowedStrings.some((str) => {
    const pattern = new RegExp(str, "g");
    if (pattern.test(reqBody.title))
      throw new ResponseError(403, `Invalid string in title: ${str}`);
    return true;
  });

  // Validate description
  const descriptionError = `description does not meet requirements: length ${descriptionMinLength}-${descriptionMaxLength}.`;
  if (
    !reqBody.description ||
    reqBody.description.length < descriptionMinLength ||
    reqBody.description.length > descriptionMaxLength
  )
    throw new ResponseError(403, descriptionError);

  // TODO: Validate tag desc once implemented
  // Validate and trim tags
  if (reqBody.tags && reqBody.tags instanceof Object) {
    Object.keys(reqBody.tags).forEach((tagObject) => {
      // Trim extra spaces
      // eslint-disable-next-line no-param-reassign
      reqBody.tags[tagObject].tag = trimExtraSpaces(
        reqBody.tags[tagObject].tag
      );
      // Validate length
      if (
        reqBody.tags[tagObject].tag.length < tagMinLength ||
        reqBody.tags[tagObject].tag.length > tagMaxLength
      )
        throw new ResponseError(
          403,
          `Tags (${reqBody.tags[tagObject].tag}) must have a length of ${tagMinLength}-${tagMaxLength}`
        );
    });
  }

  // TODO: Validate rules when rules have been reworked to use a list
};

module.exports = validateCommunityInputs;

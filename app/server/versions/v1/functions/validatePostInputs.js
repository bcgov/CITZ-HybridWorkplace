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
 * @description Validates inputs for creating a post.
 * @param patch true/false Only validates fields if patch=false or patch=true and the field is being changed.
 * @returns Nothing, but will throw a ResponseError if an input is invalid.
 */
const validatePostInputs = (reqBody, options, patch) => {
  const {
    titleMinLength,
    titleMaxLength,
    titleDisallowedCharacters,
    titleDisallowedStrings,
    messageMinLength,
    messageMaxLength,
  } = options;

  if (!patch || (patch && reqBody.title)) {
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
  }

  if (!patch || (patch && reqBody.message)) {
    // Validate message
    const messageLengthError = `message does not meet requirements: length ${messageMinLength}-${messageMaxLength}.`;
    if (
      !reqBody.message ||
      reqBody.message.length < messageMinLength ||
      reqBody.message.length > messageMaxLength
    )
      throw new ResponseError(403, messageLengthError);
  }
};

module.exports = validatePostInputs;

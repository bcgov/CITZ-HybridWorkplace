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

const ResponseError = require("../classes/responseError");
const trimExtraSpaces = require("./trimExtraSpaces");

/**
 * @description Validates inputs for creating a post.
 * @param patch true/false Only validates fields if patch=false or patch=true and the field is being changed.
 * @returns Nothing, but will throw a ResponseError if an input is invalid.
 */
const validateCommunityInputs = (reqBody, options, patch) => {
  const {
    titleMinLength,
    titleMaxLength,
    titleDisallowedCharacters,
    titleDisallowedStrings,
    descriptionMinLength,
    descriptionMaxLength,
    tagMinLength,
    tagMaxLength,
    tagDescriptionMinLength,
    tagDescriptionMaxLength,
    ruleMinLength,
    ruleMaxLength,
    ruleDescriptionMinLength,
    ruleDescriptionMaxLength,
  } = options;

  if (!patch || (patch && reqBody.title)) {
    // Validate title length
    const titleLengthRegexStr = `.{${titleMinLength},${titleMaxLength}}`;
    const titleLengthPattern = new RegExp(titleLengthRegexStr, "g");
    // Validate title disallowed characters
    const titleCharsRegexStr = `[${titleDisallowedCharacters}]`;
    const titleCharsPattern = new RegExp(titleCharsRegexStr, "g");
    // Create a user-readable string to display disallowed characters
    const titleDisallowedCharactersReplace = titleDisallowedCharacters
      .replace(/^\\/g, "x")
      .replaceAll("\\", "")
      .replace("x", "\\");
    const titleLengthError = `title does not meet requirements: length ${titleMinLength}-${titleMaxLength}.`;
    const titleCharsError = `title does not meet requirements: must not contain characters (${titleDisallowedCharactersReplace}).`;
    if (!titleLengthPattern.test(reqBody.title))
      throw new ResponseError(403, titleLengthError);
    if (titleCharsPattern.test(reqBody.title))
      throw new ResponseError(403, titleCharsError);

    titleDisallowedStrings.some((str) => {
      const pattern = new RegExp(str, "g");
      if (pattern.test(reqBody.title))
        throw new ResponseError(403, `Invalid string in title: ${str}`);
      return true;
    });
  }

  if (!patch || (patch && reqBody.description)) {
    // Validate description
    const descriptionError = `description does not meet requirements: length ${descriptionMinLength}-${descriptionMaxLength}.`;
    if (
      !reqBody.description ||
      reqBody.description.length < descriptionMinLength ||
      reqBody.description.length > descriptionMaxLength
    )
      throw new ResponseError(403, descriptionError);
  }

  if (!patch || (patch && reqBody.tags)) {
    // Validate and trim tags
    if (reqBody.tags && reqBody.tags instanceof Object) {
      Object.keys(reqBody.tags).forEach((tagObject) => {
        // Check for setting count
        if (reqBody.tags[tagObject].count)
          throw new ResponseError(403, `Not allowed to set count on tags.`);

        // Trim extra spaces
        reqBody.tags[tagObject].tag = trimExtraSpaces(
          reqBody.tags[tagObject].tag
        );
        reqBody.tags[tagObject].description = trimExtraSpaces(
          reqBody.tags[tagObject].description
        );

        // Validate tag length
        if (
          reqBody.tags[tagObject].tag.length < tagMinLength ||
          reqBody.tags[tagObject].tag.length > tagMaxLength
        )
          throw new ResponseError(
            403,
            `Tags (${reqBody.tags[tagObject].tag}) must have a length of ${tagMinLength}-${tagMaxLength}`
          );

        if (reqBody.tags[tagObject].tag.contains("#"))
          throw new ResponseError(
            403,
            `Tag (${reqBody.tags[tagObject].tag}) must not contain the character '#'.`
          );

        // Validate tag description length
        if (
          reqBody.tags[tagObject].description &&
          (reqBody.tags[tagObject].description.length <
            tagDescriptionMinLength ||
            reqBody.tags[tagObject].description.length >
              tagDescriptionMaxLength)
        )
          throw new ResponseError(
            403,
            `Tags (${reqBody.tags[tagObject].tag}) description must have a length of ${tagDescriptionMinLength}-${tagDescriptionMaxLength}`
          );
      });
    }
  }

  if (!patch || (patch && reqBody.rules)) {
    // Validate rules
    if (reqBody.rules && reqBody.rules instanceof Object) {
      Object.keys(reqBody.rules).forEach((ruleObject) => {
        // Trim extra spaces
        reqBody.rules[ruleObject].rule = trimExtraSpaces(
          reqBody.rules[ruleObject].rule
        );
        reqBody.rules[ruleObject].description = trimExtraSpaces(
          reqBody.rules[ruleObject].description
        );

        // Validate rule length
        if (
          reqBody.rules[ruleObject].rule.length < ruleMinLength ||
          reqBody.rules[ruleObject].rule.length > ruleMaxLength
        )
          throw new ResponseError(
            403,
            `Rules (${reqBody.rules[ruleObject].rule}) must have a length of ${ruleMinLength}-${ruleMaxLength}`
          );

        // Validate rule description length
        if (
          reqBody.rules[ruleObject].description &&
          (reqBody.rules[ruleObject].description.length <
            ruleDescriptionMinLength ||
            reqBody.rules[ruleObject].description.length >
              ruleDescriptionMaxLength)
        )
          throw new ResponseError(
            403,
            `Rules (${reqBody.rules[ruleObject].rule}) description must have a length of ${ruleDescriptionMinLength}-${ruleDescriptionMaxLength}`
          );
      });
    }
  }
};

module.exports = validateCommunityInputs;

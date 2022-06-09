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

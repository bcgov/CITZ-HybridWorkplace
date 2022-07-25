/* eslint-disable no-useless-escape */
/* eslint-disable node/no-unpublished-require */
/* eslint-disable import/no-extraneous-dependencies */
const RandExp = require("randexp");

// Authorization fields
const name = new RandExp(/^[A-Za-z]{8}$/); // generate random names, for IDIR field
const password = new RandExp(
  /^[A-Z]{2,4}[a-z]{2,4}[0-9]{2,4}[!@#$%^&*()]{2,4}$/
); // generate good random passwords
const email = new RandExp(/^[a-z]{10}@[a-z]{3}\.[a-z]{2,3}$/); // generate valid emails

// Numbers
const positive = new RandExp(/^\d*\.\d+$/);
const positiveInt = new RandExp(/^\d+$/);
const negative = new RandExp(/^-\d*\.\d+$/);
const negativeInt = new RandExp(/^-\d+$/);

// Strings
const largeString = new RandExp(/[\w]{1000}/);
const characters = new RandExp(/[!@#~$%^&*(*)-_+=/?;:|\\{}><.,]+/);

module.exports = {
  password,
  name,
  email,
  positive,
  positiveInt,
  negative,
  negativeInt,
  largeString,
  characters,
};

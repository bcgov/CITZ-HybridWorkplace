/* eslint-disable no-undef */
const { AuthFunctions } = require("../functions/authFunctions");
const { CommunityFunctions } = require("../functions/communityFunctions");
const user = require("../functions/userFunctions");
const {
  password,
  name,
  email,
  positive,
  positiveInt,
  negative,
  negativeInt,
  largeString,
  characters,
} = require("../functions/randomizer");

const auth = new AuthFunctions();

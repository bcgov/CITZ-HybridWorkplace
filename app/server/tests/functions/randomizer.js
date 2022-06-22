const RandExp = require('randexp');

// Authorization fields
let password = new RandExp(/^(?=.*\d)(?=.*[\W]).{8,}$/); // generate good random passwords
let name = new RandExp(/^[A-Za-z]{2,}$/); // generate random names, for IDIR field
let email = new RandExp(/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/); // generate valid emails

// Numbers
let positive = new RandExp(/^\d*\.?\d+$/);
let positiveInt = new RandExp(/^\d+$/);
let negative = new RandExp(/^-\d*\.?\d+$/);
let negativeInt = new RandExp(/^-\d+$/);

// Strings
let largeString = new RandExp(/[\w]{1000}/);
let characters = new RandExp(/[!@#~$%^&*(*)-_+=/?;:|\\\{\}><.,]+/);


module.exports = { password, name, email, positive, positiveInt, negative, negativeInt, largeString, characters };

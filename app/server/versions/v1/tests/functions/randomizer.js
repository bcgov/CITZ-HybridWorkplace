const RandExp = require('randexp');

// Authorization fields
let name = new RandExp(/^[A-Za-z]{8}$/); // generate random names, for IDIR field
let password = new RandExp(/^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s).{8}$/); // generate good random passwords
let email = new RandExp(/^\w+([\\.-]\w+)*@\w+([\\.-]\w+)*(\.\w{2,3})+$/); // generate valid emails

// Numbers
let positive = new RandExp(/^\d*\.\d+$/);
let positiveInt = new RandExp(/^\d+$/);
let negative = new RandExp(/^-\d*\.\d+$/);
let negativeInt = new RandExp(/^-\d+$/);

// Strings
let largeString = new RandExp(/[\w]{1000}/);
let characters = new RandExp(/[!@#~$%^&*(*)-_+=/?;:|\\\{\}><.,]+/);


module.exports = { password, name, email, positive, positiveInt, negative, negativeInt, largeString, characters };

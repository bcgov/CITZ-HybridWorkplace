require('dotenv').config();
const jwt = require('jsonwebtoken');

function generateToken(user) {
    return jwt.sign({
        name: user.name, password: user.password
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRY });
}

module.exports = generateToken;

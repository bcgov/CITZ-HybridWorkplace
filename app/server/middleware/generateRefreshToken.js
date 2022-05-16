require('dotenv').config();
const jwt = require('jsonwebtoken');

function generateRefreshToken(user) {
    return jwt.sign({
        name: user.name, password: user.password
    }, process.env.JWT_REFRESH_SECRET);
}

module.exports = generateRefreshToken;

/**
 * @file A helper function which houses methods that are used commonly in the server
 * 
 * @author Brandon Bouchard
 * 
 * @module
 * @function
 * 
 */

const authenticateToken = function (req, res, next) {
  const authHeader = req.headers['Authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403)

    req.user.name = decoded.name

    next()
  })
}

module.exports = authenticateToken;

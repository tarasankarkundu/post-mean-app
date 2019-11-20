const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET) // verify the token agan the sect it was created with (a_super_long_string_as_secret)
        req.userData = {email: decodedToken.email, userId: decodedToken.userId},
        next();
    } catch {
        res.status(401).json({
            message: 'You are not authenticated!'
        })
    }
}

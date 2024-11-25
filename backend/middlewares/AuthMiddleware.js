import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;

    // If no token exists in the cookie
    if (!token) {
        return res.status(401).json({
            message: "You are not authorized. No token provided.",
            status: false
        });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
        if (err) {
            // If token is invalid or expired
            return res.status(401).json({
                status: false,
                message: "Token is not valid or has expired."
            });
        } 

        // If the token is valid, attach the userId to the request object
        req.userId = payload.userId;

        // Call the next middleware or route handler
        next();
    });
};

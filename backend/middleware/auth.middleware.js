const checkAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).send({ message: "Unauthorized: Please log in." });
    }
    next();
};

/**
 * A reusable middleware that checks if the user's role is in the allowed list.
 * @param {string[]} allowedRoles - An array of roles that are allowed to access the route.
 */
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.session.role;
        
        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).send({ 
                message: `Forbidden: This resource requires one of the following roles: ${allowedRoles.join(', ')}.` 
            });
        }
        
        next();
    };
};

module.exports = {
    checkAuth,
    checkRole
};
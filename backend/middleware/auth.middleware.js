const checkAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send({ message: "Unauthorized: Please log in." });
  }
  next();
};

const checkAdmin = (req, res, next) => {
  if (req.session.role !== 'Admin') {
    return res.status(403).send({ message: "Forbidden: Requires Admin role." });
  }
  next();
};

const checkManager = (req, res, next) => {
    if (req.session.role !== 'Manager' && req.session.role !== 'Admin') {
        return res.status(403).send({ message: "Forbidden: Requires Manager or Admin role." });
    }
    next();
};

module.exports = { checkAuth, checkAdmin, checkManager };
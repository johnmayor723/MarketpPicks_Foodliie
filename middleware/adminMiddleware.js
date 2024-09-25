const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // If user is admin, proceed
  } else {
    res.status(403).json({ message: 'Access denied, admin only' });
  }
};

module.exports = adminMiddleware;
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

module.exports = function(sequelize) {
  const store = new SequelizeStore({
    db: sequelize,
  });

  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    store: store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      httpOnly: true, // Prevents client-side JS from reading the cookie
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  });

  store.sync(); // This will create the Sessions table
  return sessionMiddleware;
};
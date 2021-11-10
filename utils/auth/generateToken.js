const jwt = require('jsonwebtoken');
const { config } = require('../../config/index.js');

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    config.jwt_secret || 'somethingsecret',
    {
      expiresIn: '30d',
    }
  );
};

module.exports = { generateToken }


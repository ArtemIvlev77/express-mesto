const jwt = require('jsonwebtoken');
const UnauthorisedError = require('../errors/unauthorised-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorisedError('Не удалось авторизироваться');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    throw new UnauthorisedError('Не удалось авторизироваться');
  }

  req.user = payload;

  return next();
};

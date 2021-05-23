const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorisation } = req.headers;
  if (!authorisation || !authorisation.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Нет доступа' });
  }

  const token = authorisation.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super_secret_key');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
};

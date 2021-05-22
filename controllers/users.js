const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const JWT_SECRET_KEY = 'super_secret_key';

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password).then((user) => {
    const token = jwt.sign(
      {
        _id: user._id,
      },
      JWT_SECRET_KEY, { expiresIn: '7d' },
    );
    return res.send({ jwt: token });
  })
    .catch(() => {
      res.status(401).send({ message: 'Не удалось произвести авторизацию' });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

exports.getMe = (req, res, next) => {
  const { authorisation } = req.headers;
  if (!authorisation || authorisation.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'нет доступа' });
  }

  const token = authorisation.replace('Bearer ', '');
  const isAuthorised = () => {
    try {
      return jwt.verify(token, JWT_SECRET_KEY);
    } catch (err) {
      return false;
    }
  };

  if (!isAuthorised(token)) {
    res.status(403).send({ message: 'Доступ запрещен' });
  }
  return User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(
          res
            .status(404)
            .send({ message: 'пользователь с таким _id не найден' }),
        );
      }
      return res.send({ data: user });
    })
    .catch(next);
};

exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(404)
          .send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(500).send({ message: `Ошибка на сервере: ${err}` });
      }
    })
    .catch(next);
};

exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => res.send({ mail: user.email }))
      .catch((err) => {
        if (err.name === 'CastError' || err.name === 'ValidationError') {
          res.status(400).send({
            message: 'Переданы некорректные данные при создании профиля',
          });
        } else if (err.message === 'MongoError' && err.code === 11000) {
          res
            .status(409)
            .send({ message: 'Такой email уже зарегистрирован' });
        } else {
          res.status(500).send({ message: `Ошибка на сервере: ${err}` });
        }
      }))
    .catch(next);
};

exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  return User.findByIdAndUpdate(owner, { name, about }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      } else if (err.message === 'NotFound') {
        res
          .status(404)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.status(500).send({ message: `Ошибка на сервере: ${err}` });
      }
    })
    .catch(next);
};

exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  return User.findByIdAndUpdate(owner, { avatar }, { new: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      } else if (err.message === 'NotFound') {
        res
          .status(404)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.status(500).send({ message: `Ошибка на сервере: ${err}` });
      }
    })
    .catch(next);
};

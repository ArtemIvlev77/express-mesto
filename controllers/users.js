const { User } = require('../models/user');

exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }))
    .catch(next);
};

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  res.send(await user.save());
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

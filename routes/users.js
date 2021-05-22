const express = require('express');
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  createUser,
  getUserById,
  updateAvatar,
  updateProfile,
  getMe,
} = require('../controllers/users');

const usersRoute = express.Router();

usersRoute.get('/', getUsers);
usersRoute.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).required().hex(),
    }),
  }),
  getUserById,
);
usersRoute.post('/', createUser);
usersRoute.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateProfile,
);
usersRoute.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().regex(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]+\.[a-zA-Z0-9()]+([-a-zA-Z0-9()@:%_\\+.~#?&/=#]*)/,
      ),
    }),
  }),
  updateAvatar,
);
usersRoute.get('/me', getMe);

module.exports = {
  usersRoute,
};

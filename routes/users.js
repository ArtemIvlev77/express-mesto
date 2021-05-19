const express = require('express');
const {
  getUsers,
  createUser,
  getUserById,
  updateAvatar,
  updateProfile,
} = require('../controllers/users');

const usersRoute = express.Router();

usersRoute.get('/', getUsers);
usersRoute.get('/:userId', getUserById);
usersRoute.post('/', createUser);
usersRoute.patch('/me', updateProfile);
usersRoute.patch('/me/avatar', updateAvatar);

module.exports = {
  usersRoute,
};

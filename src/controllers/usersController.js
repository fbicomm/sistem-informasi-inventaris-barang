const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const usersQuery = require('../queries/usersQuery');

const getUsers = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const users = await usersQuery.getUsers();
    res.render('users', {
      usr: users,
      user: req.session.user.email,
      title: 'Manage Users',
    });
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const addUser = [
  body('email').custom(async (value) => {
    const duplicate = await usersQuery.email2(value.toLowerCase());
    if (duplicate) {
      throw new Error('Add user failed: email already exists.');
    }
    return true;
  }),
  async (req, res) => {
    if (req.session.user && req.session.user.role === 'superadmin') {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const users = await usersQuery.getUsers();
        res.render('users', {
          title: 'Manage Users',
          errors: errors.array(),
          usr: users,
          user: req.session.user.email,
        });
      } else {
        const { email } = req.body;
        const password = await bcrypt.hash(req.body.password, 10);
        const { role } = req.body;

        await usersQuery.addUser(email, password, role);

        res.redirect('/users');
      }
    } else {
      res.status(401);
      res.render('401', { title: '401 Error' });
    }
  },
];

const updateUser = [
  body('email').custom(async (value, { req }) => {
    const duplicate = await usersQuery.checkDuplicate(value.toLowerCase());
    if (value !== req.body.oldEmail && duplicate) {
      throw new Error('Edit pengguna gagal: email sudah ada.');
    }
    return true;
  }),
  async (req, res) => {
    if (req.session.user && req.session.user.role === 'superadmin') {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const users = await usersQuery.getUsers();
        res.render('users', {
          title: 'Manage Users',
          errors: errors.array(),
          usr: users,
          user: req.session.user.email,
        });
      } else {
        await usersQuery.updateUser(req.body);
        res.redirect('/users');
      }
    } else {
      res.status(401);
      res.render('401', { title: '401 Error' });
    }
  },
];

const deleteUser = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    await usersQuery.delUser(req.params.id);
    res.redirect('/users');
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const resetPassword = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const password = await bcrypt.hash('password', 10);
    await usersQuery.updatePassword(password, req.params.id);
    const users = await usersQuery.getUsers();
    res.render('users', {
      usr: users,
      user: req.session.user.email,
      title: 'Manage Users',
      resetSuccess: 'Reset password berhasil.',
    });
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  resetPassword,
};

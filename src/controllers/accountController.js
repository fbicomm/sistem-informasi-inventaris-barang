const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const usersQuery = require('../queries/usersQuery');

const getAccount = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const users = await usersQuery.checkProfile(req.session.user.email);
    res.render('account', {
      usr: users,
      user: req.session.user.email,
      title: 'Edit Account',
    });
  } else if (req.session.user && req.session.user.role === 'user') {
    const users = await usersQuery.checkProfile(req.session.user.email);
    res.render('account', {
      usr: users,
      us: req.session.user.email,
      title: 'Edit Account',
    });
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const changeEmail = [
  body('email').custom(async (value, { req }) => {
    const duplicate = await usersQuery.checkDuplicate(value.toLowerCase());
    if (value === req.body.oldEmail) {
      throw new Error(
        'Replace email failed: the new email cannot be the same as the current email.',
      );
    }
    if (duplicate) {
      throw new Error('Replace email failed: email already exists.');
    }
    return true;
  }),
  body('password').custom(async (value, { req }) => {
    const checkPass = await bcrypt.compare(value, req.body.matchPass);
    if (!checkPass) {
      throw new Error('Change email failed: wrong password.');
    }
    return true;
  }),
  async (req, res) => {
    if (req.session.user && req.session.user.email !== 'superadmin@email.com') {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render('account', {
          title: 'Account',
          errors: errors.array(),
          usr: req.body,
          user: req.session.user.email,
        });
      } else {
        await usersQuery.updateEmail(req.body);
        req.session = null;
        res.render('login', {
          title: 'Login',
          logout: 'Change of email was successful, please log in again.',
        });
      }
    } else {
      res.status(401);
      res.render('401', { title: '401 Error' });
    }
  },
];

const changePassword = [
  body('oldPassword').custom(async (value, { req }) => {
    const checkPass = await bcrypt.compare(value, req.body.matchPass);
    if (!checkPass) {
      throw new Error('Change password failed: old password is wrong.');
    }
    return true;
  }),
  body('password').custom(async (value, { req }) => {
    const checkPass = await bcrypt.compare(value, req.body.matchPass);
    if (checkPass) {
      throw new Error(
        'Change password failed: the new password cannot be the same as the old password.',
      );
    }
    return true;
  }),
  body('confirmPassword').custom(async (value, { req }) => {
    if (value !== req.body.password) {
      throw new Error(
        'Change password failed: new password and confirm new password do not match.',
      );
    }
    return true;
  }),
  async (req, res) => {
    if (req.session.user && req.session.user.role === 'superadmin') {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render('account', {
          title: 'Account',
          errors: errors.array(),
          usr: req.body,
          user: req.session.user.email,
        });
      } else {
        const password = await bcrypt.hash(req.body.password, 10);
        const { id } = req.body;

        await usersQuery.updatePassword(password, id);
        req.session = null;
        res.render('login', {
          title: 'Login',
          logout: 'Changed password successfully, please log in again.',
        });
      }
    } else if (req.session.user && req.session.user.role === 'user') {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render('account', {
          title: 'Account',
          errors: errors.array(),
          usr: req.body,
          us: req.session.user.email,
        });
      } else {
        const password = await bcrypt.hash(req.body.password, 10);
        const { id } = req.body;

        await usersQuery.updatePassword(password, id);
        req.session = null;
        res.render('login', {
          title: 'Login',
          logout: 'Changed password successfully, please log in again.',
        });
      }
    } else {
      res.status(401);
      res.render('401', { title: '401 Error' });
    }
  },
];

const changeRole = [
  body('password').custom(async (value, { req }) => {
    const checkPass = await bcrypt.compare(value, req.body.matchPass);
    if (!checkPass) {
      throw new Error('Change role failed: wrong password.');
    }
    return true;
  }),
  async (req, res) => {
    if (req.session.user && req.session.user.email !== 'superadmin@email.com') {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render('account', {
          title: 'Account',
          errors: errors.array(),
          usr: req.body,
          user: req.session.user.email,
        });
      } else {
        await usersQuery.updateRole(req.body);
        req.session = null;
        res.render('login', {
          title: 'Login',
          logout: 'The role change was successful, please log in again.',
        });
      }
    } else {
      res.status(401);
      res.render('401', { title: '401 Error' });
    }
  },
];

module.exports = {
  getAccount,
  changeEmail,
  changePassword,
  changeRole,
};

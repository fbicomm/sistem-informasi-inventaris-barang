const bcrypt = require('bcrypt');
const usersQuery = require('../queries/usersQuery');

const login = async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;

  const checkPass = await bcrypt.compare(
    password,
    await usersQuery.checkPassword(email),
  );

  if (
    email === (await usersQuery.email(email))
    && checkPass
    && (await usersQuery.checkRole(email)) === 'superadmin'
  ) {
    req.session.user = {
      email,
      role: 'superadmin',
    };
    res.redirect('/');
  } else if (
    email === (await usersQuery.email(email))
    && checkPass
    && (await usersQuery.checkRole(email)) === 'user'
  ) {
    req.session.user = {
      email,
      role: 'user',
    };
    res.redirect('/');
  } else {
    res.render('login', {
      title: 'Login',
      loginFail: 'E-mail ou senha incorretos.',
    });
  }
};

const logout = (req, res) => {
  req.session = null;
  res.render('login', { title: 'Login', logout: 'O logout foi bem-sucedido.' });
};

module.exports = {
  login,
  logout,
};

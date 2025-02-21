const express = require('express');
const methodOverride = require('method-override');
const cookieSession = require('cookie-session');
const crypto = require('crypto');
const path = require('path');
const morgan = require('morgan');

const log = require('./queries/logQuery');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const usersRoutes = require('./routes/usersRoutes');
const accountRoutes = require('./routes/accountRoutes');
const itemsRoutes = require('./routes/itemsRoutes');
const itemsIncomingRoutes = require('./routes/itemsIncomingRoutes');
const itemsWithdrawalRoutes = require('./routes/itemsWithdrawalRoutes');
const logRoutes = require('./routes/logRoutes');


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(
  cookieSession({
    name: 'session',
    keys: [crypto.randomBytes(16).toString('hex')],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }),
);

// Static files
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use('/jquery', express.static(path.join(__dirname, '../node_modules/jquery/dist')));
app.use('/select2', express.static(path.join(__dirname, '../node_modules/select2/dist')));
app.use('/pdfmake', express.static(path.join(__dirname, '../node_modules/pdfmake/build')));
app.use('/html5-qrcode', express.static(path.join(__dirname, '../node_modules/html5-qrcode')));
app.use('/fontawesome-free', express.static(path.join(__dirname, '../node_modules/@fortawesome/fontawesome-free')));

app.use('/admin-lte', express.static(path.join(__dirname, '../node_modules/admin-lte/dist')));

app.use('/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
app.use('/icheck-bootstrap', express.static(path.join(__dirname, '../node_modules/icheck-bootstrap')));
app.use('/select2-bootstrap-5-theme', express.static(path.join(__dirname, '../node_modules/select2-bootstrap-5-theme/dist')));

app.use('/datatables.net', express.static(path.join(__dirname, '../node_modules/datatables.net')));
app.use('/datatables.net-bs5', express.static(path.join(__dirname, '../node_modules/datatables.net-bs5')));
app.use('/datatables.net-responsive', express.static(path.join(__dirname, '../node_modules/datatables.net-responsive')));
app.use('/datatables.net-responsive-bs5', express.static(path.join(__dirname, '../node_modules/datatables.net-responsive-bs5')));
app.use('/datatables.net-buttons', express.static(path.join(__dirname, '../node_modules/datatables.net-buttons')));
app.use('/datatables.net-buttons-bs5', express.static(path.join(__dirname, '../node_modules/datatables.net-buttons-bs5')));

// Custom logger
const custom = (tokens, req, res) => {
  if (req.session && req.session.user) {
    const user = req.session.user.email;
    const method = tokens.method(req, res);
    const endpoint = tokens.url(req, res);
    const statusCode = tokens.status(req, res);

    if (method != "GET") {
      log.addLog(user, method, endpoint, statusCode);
    }
  }
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
  ].join(' ');
};

app.use(morgan(custom));

app.use(authRoutes);
app.use(dashboardRoutes);
app.use(usersRoutes);
app.use(accountRoutes);
app.use(itemsRoutes);
app.use(itemsIncomingRoutes);
app.use(itemsWithdrawalRoutes);
app.use(logRoutes);

app.get('*', (req, res) => {
  res.status(404).render('404', { title: '404 Error' });
});

module.exports = app;

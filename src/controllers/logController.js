const moment = require('moment');
const log = require('../queries/logQuery');

const getLog = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const logs = await log.getLog();
    res.render('log', {
      log: logs,
      user: req.session.user.email,
      title: 'Application Logs',
      moment,
    });
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const clearLogs = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    await log.clearLogs();
    const logs = await log.getLog();
    res.render('log', {
      log: logs,
      user: req.session.user.email,
      title: 'Application Logs',
      moment,
    });
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};


module.exports = {
  getLog,
  clearLogs
};

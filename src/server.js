require('dotenv').config();

const createDB = require('./database/create');

(async function () {
  await createDB();

  const app = require('./app');

  app.listen(3000, () => {
    console.log(`Listening to the server on http://127.0.0.1:3000`);
  });
})();

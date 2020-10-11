const { port, env } = require('./config/variables');
const logger = require('./config/logger');
const mongoose = require('./config/mongoose');
const app = require('./config/app');

// mongoose database connection
mongoose.connect();

// listen to requests
app.listen(port, () => logger.info(`Server started on port ${port} (${env})`));

module.exports = app;

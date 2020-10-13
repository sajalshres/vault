const mongoose = require('mongoose');
const logger = require('./../config/logger');
const { mongo, env } = require('./variables');

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err}`);
});

if (env === 'development') {
  mongoose.set('debug', true);
}

exports.connect = () => {
  mongoose
    .connect(mongo.uri, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => logger.info('mondgoDB connected...'));

  return mongoose.connection;
};

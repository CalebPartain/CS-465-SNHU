const mongoose = require('mongoose');
const readLine = require ('readline');



let dbURL = 'mongodb://127.0.0.1/travlr';
if (process.env.NODE_ENV === 'production') {
  dbURL = process.env.DB_HOST || process.env.MONGODB_URI;
}

const connect = () => {
  setTimeout(() => mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }), 1000);
}


mongoose.connection.on('connected', () => {            1
    console.log(`connected`);       1
  });                                                    1
  mongoose.connection.on('error', err => {               2
    console.log('Mongoose connection error:', err);      2
  });                                                    2
  mongoose.connection.on('disconnected', () => {         3
    console.log('Mongoose disconnected');                3
  });     


if (process.platform === 'win32'){
  const rl = readLine.createInterface ({
    input: process.stdin,
    output: process.stdout
  });
  rl.on ('SIGINT', () => {
    process.emit ("SIGINT");
  });
}

const gracefulShutdown = (msg, callback) => {                1
  mongoose.connection.close( () => {                         2
    console.log(`Mongoose disconnected through ${msg}`);     3
    callback();                                              3
  });
};

process.once('SIGUSR2', () => {                        1
  gracefulShutdown('nodemon restart', () => {          2
    process.kill(process.pid, 'SIGUSR2');              2
  });
});
process.on('SIGINT', () => {                           3
  gracefulShutdown('app termination', () => {          4
    process.exit(0);                                   4
  });
});
process.on('SIGTERM', () => {                          5
  gracefulShutdown('Heroku app shutdown', () => {      6
    process.exit(0);                                   6
  });
});

connect();

require('./travlr');
require('./user');
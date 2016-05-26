import path from 'path';

let config = {};

config.workingDir = path.join(__dirname, '..');
config.port = process.env.PORT || 3006;
config.mongodb = {
  // vrbose db, user and a messages collection has to be created
  // use vrbose
  // db.createUser({"user": "vrbose", "pwd": "vrbose", "roles": [{role: "readWrite", db: "vrbose"}]});
  // db.createCollection("messages");
  uri: process.env.MONGO_URI || 'mongodb://vrbose:vrbose@localhost/vrbose'
};
config.cryptoKey = 'milutth3c4t';
config.loginAttempts = {
  forIp: 50,
  forIpAndUser: 7,
  logExpiration: '20m'
};

export default config;

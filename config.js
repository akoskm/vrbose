let config = {};

config.port = process.env.PORT || 3030;
config.mongodb = {
  // use vrbose
  // db.createUser({"user": "vrbose", "pwd": "vrbose", "roles": [{role: "readWrite", db: "vrbose"}]});
  // db.createCollection("messages");
  uri: 'mongodb://vrbose:vrbose@localhost/vrbose'
};

export default config;

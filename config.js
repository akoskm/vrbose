let config = {};

config.port = process.env.PORT || 3030;
config.mongodb = {
  // vrbose db, user and a messages collection has to be created
  // use vrbose
  // db.createUser({"user": "vrbose", "pwd": "vrbose", "roles": [{role: "readWrite", db: "vrbose"}]});
  // db.createCollection("messages");
  uri: 'mongodb://vrbose:vrbose@localhost/vrbose'
};

export default config;

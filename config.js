let config = {};

config.port = process.env.PORT || 3006;
config.mongodb = {
  // vrbose db, user and a messages collection has to be created
  // use vrbose
  // db.createUser({"user": "vrbose", "pwd": "vrbose", "roles": [{role: "readWrite", db: "vrbose"}]});
  // db.createCollection("messages");
  uri: process.env.MONGO_URI || 'mongodb://vrbose:vrbose@localhost/vrbose'
};

export default config;

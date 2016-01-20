let config = {};

config.port = process.env.PORT || 3000;
config.mongodb = {
  uri: 'mongodb://vrbose:vrbose@localhost/vrbose'
};

export default config;

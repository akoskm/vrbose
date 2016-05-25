import config from './config';
import mongoose from 'mongoose';
import express from 'express';
import http from 'http';
import MessageSchema from './schema/Message';
import WatcherSchema from './schema/Watcher';
import log4js from 'log4js';
import bodyParser from 'body-parser';
import AppendWatcher from './appendwatcher';

// logger configuration
log4js.configure('./config/log4js.json');
let logger = log4js.getLogger();

const app = express();
const mongoConfig = {
  server: {
    poolSize: config.poolSize
  }
};
const autoIndex = (app.get('env') === 'development');
logger.info('autoIndex:', autoIndex);


app.config = config;
app.server = http.createServer(app);
app.disable('x-powered-by');
app.set('port', config.port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//setup mongoose
mongoose.connect(config.mongodb.uri, mongoConfig);
MessageSchema(autoIndex);
WatcherSchema(autoIndex);

app.get('/', function (req, res) {
  res.send('vrbose is running');
});

app.server.listen(app.config.port, function(){
  logger.info('vrbose is running on port', app.config.port);
});

let newWatcherCfg = {
  id: 'INFO_AND_ERROR',
  path: '.',
  name: 'INFO and ERROR',
  description: 'Watch for [INFO] and [ERROR] occurance in this file',
  filename: 'myfile1.txt',
  matchers: [{
    name: 'INFO',
    regex: /\[INFO\]/
  }, {
    name: 'ERROR',
    regex: /\[ERROR\]/
  }]
};

mongoose.model('Watcher').find(function (err, docs) {
  if (err) {
    throw err;
  }
  if (!docs || docs.length < 1) {
    mongoose.model('Watcher').create(newWatcherCfg, function (err, doc) {
      if (err) throw err
      console.log(doc);
    })
  }
});

const appendWatcher = AppendWatcher.watch(newWatcherCfg.filename);
let counter = 0;
appendWatcher
  .on('append', function (message) {
    if (message) {
      var matches = newWatcherCfg.matchers.map(function (m) {
        var result = message.match(m.regex);
        return {
          name: m.name,
          regex: m.regex,
          count: result ? result.length : 0
        }
      });
      var updateMatchers = matches.map(function (mr) {
        return {
          query: {
            'id': newWatcherCfg.id,
            'matchers.name': mr.name
          },
          update: {
            $inc: {
              'total': mr.count,
              'matchers.$.count': mr.count
            }
          }
        };
      });
      updateMatchers.forEach(function (um) {
        mongoose.model('Watcher').update(um.query, um.update, function (err, doc) {
          if (err) throw err;
          console.log(doc);
        });
      });
    }
  })
  .on('error', function (err) {
    throw err;
  });

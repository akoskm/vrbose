import config from './config';
import mongoose from 'mongoose';
import express from 'express';
import http from 'http';
import MessageSchema from './schema/Message';
import log4js from 'log4js';
import bodyParser from 'body-parser';

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
app.db = mongoose.createConnection(config.mongodb.uri, mongoConfig);
app.db.model('Message', MessageSchema(autoIndex));

let sendErr = function(res, msg) {
  res.status(200).json({
    success: false, message: msg
  });
};

app.get('/', function (req, res) {
  res.send('vrbose is running');
});

app.post('/write', function (req, res) {
  let body = req.body;
  let message;

  if (body === null || typeof body !== 'object' || typeof body.log !== 'object') {
    sendErr(res, 'request body is missing');
  } else {
    let log = body.log;
    if (log.data === null || log.data === undefined) {
      sendErr(res, 'message is missing from request body');
    } else if (log.createdBy === null || log.createdBy === undefined) {
      sendErr(res, 'createdBy is missing from request body');
    } else {
      message = {
        data: log.data,
        createdBy: log.createdBy,
        level: log.level,
        topic: log.topic
      };

      console.log(message);

      app.db.models.Message.create(message, function(err, doc) {
        if (err) {
          logger.error(err);
        }

        logger.debug('message saved');

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
          success: true, message: 'saved'
        });
      });
    }
  }
});

app.get('/read', function (req, res) {
  let skip = req.query.skip || 0;
  let limit = req.query.limit || 100;

  app.db.models.Message.find().skip(skip).limit(limit).sort('-createdBy').exec(function(err, messages) {
    if (err) {
      logger.error(err);
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(messages);
  });
});

app.server.listen(app.config.port, function(){
  logger.info('vrbose is running on port', app.config.port);
});

import config from './config';
import mongoose from 'mongoose';
import express from 'express';
import http from 'http';
import MessageSchema from './schema/Message';
import log4js from 'log4js';
import bodyParser from 'body-parser';
import apiFactory from './api';
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

app.get('/', function (req, res) {
  res.send('vrbose is running');
});

const api = apiFactory(app, logger);

app.post('/write', api.write);

app.get('/read', api.read);

app.server.listen(app.config.port, function(){
  logger.info('vrbose is running on port', app.config.port);
});

const appendWatcher = AppendWatcher.watchAppend('myfile.txt');
appendWatcher
  .on('append', function (message) {
    console.log(message);
  })
  .on('error', function (err) {
    throw err;
  });

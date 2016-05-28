import path from 'path';
import config from './config';
import mongoose from 'mongoose';
import csrf from 'csurf';
import React from 'react';
import SocketIO from 'socket.io';

import passport from './util/passport';
import { logger } from './util/logger';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import express from 'express';
import http from 'http';
import log4js from 'log4js';
import schema from './schema';
import bodyParser from 'body-parser';

import SocketIOFactory from './util/socketio';
import api from './api';
import webpack from 'webpack';
import webpackConfig from '../webpack.config';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import watchertest from './watchertest';

// determine environment type
const nodeEnv = process.env.NODE_ENV || 'development';

const mongoConfig = {
  server: {
    poolSize: config.poolSize
  }
};

// session configuration
const mongoStore = connectMongo(session);
const sessionConfig = {
  // according to https://github.com/expressjs/session#resave
  // see "How do I know if this is necessary for my store?"
  resave: true,
  saveUninitialized: true,
  secret: config.cryptoKey,
  store: new mongoStore({ url: config.mongodb.uri }),
  cookie: {}
};

// create app
const app = express();
const server = http.Server(app);

// setup mongoose
mongoose.connect(config.mongodb.uri, mongoConfig);

// initialize logger
logger.initLogger(config);

// configure app
app.disable('x-powered-by');
// app.set('port', config.port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// webpack stuff
if (nodeEnv === 'development') {
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    // Dev middleware can't access config, so we provide publicPath
    publicPath: webpackConfig.output.publicPath,

    // pretty colored output
    stats: { colors: true }
  }));

  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(path.join(__dirname, 'dist')));
app.use('/static', express.static(path.join(__dirname, '../uploads')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(config.cryptoKey));

app.use(session(sessionConfig));

// must initialize passport after session(sessionConfig)
passport(app);

app.use(csrf({
  cookie: {
    signed: true
  },
  value(req) {
    const csrf = req.cookies._csrfToken;
    return csrf;
  }
}));

// response locals
app.use(function (req, res, next) {
  res.cookie('_csrfToken', req.csrfToken());
  res.locals.user = {};
  res.locals.user.defaultReturnUrl = '/';
  res.locals.user.username = req.user && req.user.username;
  next();
});

app.use(function (req, res, next) {
  GLOBAL.navigator = {
    userAgent: req.headers['user-agent']
  };
  next();
});

// global locals
app.locals.projectName = config.projectName;
app.locals.copyrightYear = new Date().getFullYear();
app.locals.copyrightName = config.companyName;
app.locals.cacheBreaker = 'br34k-01';

app.set('view engine', 'ejs');

// server side resources
api(app);

// socket.io setup
SocketIOFactory.initialize(server);

server.listen(config.port);
server.on('listening', () => {
  logger.instance.info('vrbose is running on port', config.port);
  watchertest();
});

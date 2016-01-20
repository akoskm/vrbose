import config from './config';
import mongoose from 'mongoose';
import express from 'express';
import http from 'http';

var app = express();

app.config = config;

//setup the web server
app.server = http.createServer(app);

//setup mongoose
app.db = mongoose.createConnection(config.mongodb.uri);

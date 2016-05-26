import fs from 'fs';
import util from 'util';
import events from 'events';
import chokidar from 'chokidar';

let id;
let matchers;
let filename;
let delimiter;
let startPos = 0;
let endPos = 100;

const AppendWatcher = function (watcher) {
  if (watcher === null || watcher === undefined) {
    throw 'Watcher is empty';
  }
  if (typeof watcher !== 'object') {
    throw 'Watcher must be object';
  }
  if (typeof watcher.filename !== 'string') {
    throw 'Filename is required';
  }
  if (typeof watcher.delimiter !== 'string') {
    throw 'Delimiter must be string';
  }
  if (!isNaN(watcher.startPos) || watcher.startPos < 1) {
    throw 'startPos of watcher must be > 0';
  }
  events.EventEmitter.call(this);
  filename = watcher.filename;
  delimiter = watcher.delimiter;
  startPos = watcher.startPos;
  id = watcher.id;
  matchers = watcher.matchers;

  let self = this;

  chokidar.watch(filename, {
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100
    }
  }).on('change', function (path, stats) {
    endPos = stats.size;
    if (endPos === 0) {
      return;
    }
    if (endPos < startPos) {
      startPos = 0;
    }
    let readStream = fs.createReadStream(filename, { start: startPos, end: endPos });
    let buffer = '';
    readStream
      .on('data', function (chunk) {
        buffer += chunk;
        let boundary = buffer.indexOf(delimiter);
        // interpret chunks delimited by delimiter
        while (boundary !== -1) {
          let input = buffer.substr(0, boundary);
          buffer = buffer.substr(boundary + 1);
          self.emit('append', input, endPos, id, matchers);
          boundary = buffer.indexOf(delimiter);
        }
      })
      .on('end', function () {
        // set start position to last character
        startPos = endPos;
      });
  }).on('error', function (error) {
    self.emit('error', error);
  });

  console.log('Watching', filename, 'for changes');
};

util.inherits(AppendWatcher, events.EventEmitter);

exports.AppendWatcher = AppendWatcher;
exports.watch = function (watcher) {
  return new AppendWatcher(watcher);
};

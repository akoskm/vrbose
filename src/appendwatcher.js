import fs from 'fs';
import util from 'util';
import events from 'events';
import chokidar from 'chokidar';

let filename;
let delimiter;
let startPos = 0;
let endPos = 100;

const AppendWatcher = function (_filename, _startPos = 0, _delimiter = '\n') {
  if (typeof _filename !== 'string') {
    throw 'Filename is required'
  }
  events.EventEmitter.call(this);
  filename = _filename;
  delimiter = _delimiter;
  startPos = _startPos;

  var self = this;

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
    var readStream = fs.createReadStream(filename, { start: startPos, end: endPos });
    var buffer = '';
    readStream
      .on('data', function (chunk) {
        buffer += chunk;
        let boundary = buffer.indexOf(delimiter);
        // interpret chunks delimited by delimiter
        while (boundary !== -1) {
          let input = buffer.substr(0, boundary);
          buffer = buffer.substr(boundary + 1);
          self.emit('append', input, endPos);
          boundary = buffer.indexOf(delimiter);
        }
      })
      .on('end', function () {
        // set start position to last character
        startPos = endPos;
      });
  }).on('error', function (error) {
    self.emit('error', error);
  });;

  console.log('Watching', filename, 'for changes');
};

util.inherits(AppendWatcher, events.EventEmitter);

exports.AppendWatcher = AppendWatcher;
exports.watch = function (filename, startPos) {
  return new AppendWatcher(filename, startPos);
};

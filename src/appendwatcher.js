import fs from 'fs';
import util from 'util';
import events from 'events';
import chokidar from 'chokidar';

let _filename;
let _delimiter;

var startPos = 0;
var endPos = 100;

const AppendWatcher = function (filename, delimiter = '\n') {
  if (typeof filename !== 'string') {
    throw 'Filename is required'
  }
  events.EventEmitter.call(this);
  _filename = filename;
  _delimiter = delimiter;

  var self = this;

  chokidar.watch(_filename, {
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
    var readStream = fs.createReadStream(_filename, { start: startPos, end: endPos });
    var buffer = '';
    readStream
      .on('data', function (chunk) {
        buffer += chunk;
        let boundary = buffer.indexOf(_delimiter);
        // interpret chunks delimited by _delimiter
        while (boundary !== -1) {
          let input = buffer.substr(0, boundary);
          buffer = buffer.substr(boundary + 1);
          self.emit('append', input);
          boundary = buffer.indexOf(_delimiter);
        }
      })
      .on('end', function () {
        // set start position to last character
        startPos = endPos;
      });
  }).on('error', function (error) {
    self.emit('error', error);
  });;

  console.log('Watching', _filename, 'for changes');
};

util.inherits(AppendWatcher, events.EventEmitter);

exports.AppendWatcher = AppendWatcher;
exports.watch = function (filename) {
  return new AppendWatcher(filename);
};

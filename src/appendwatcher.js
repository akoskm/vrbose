import fs from 'fs';
import util from 'util';
import events from 'events';
import chokidar from 'chokidar';

const filename = 'myfile.txt';

var startPos = 0;
var endPos = 100;

const AppendWatcher = function (filename) {
  events.EventEmitter.call(this);

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
    var output = '';
    readStream
      .on('data', function (chunk) {
        output += chunk.toString();
        startPos = endPos;
      })
      .on('end', function () {
        self.emit('append', output);
      });
  }).on('error', function (error) {
    self.emit('error', error);
  });;

  console.log('Watching', filename, 'for changes');
};

util.inherits(AppendWatcher, events.EventEmitter);

exports.AppendWatcher = AppendWatcher;
exports.watchAppend = function (filename) {
  return new AppendWatcher(filename);
};

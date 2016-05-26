import mongoose from 'mongoose';
import AppendWatcher from './appendwatcher';
import { logger } from './util/logger';

export default() => {
  // let newWatcherCfg = {
  //   id: 'INFO_AND_ERROR',
  //   path: '.',
  //   name: 'INFO and ERROR',
  //   description: 'Watch for [INFO] and [ERROR] occurance in this file',
  //   filename: 'myfile1.txt',
  //   matchers: [{
  //     name: 'INFO',
  //     regex: /\[INFO\]/
  //   }, {
  //     name: 'ERROR',
  //     regex: /\[ERROR\]/
  //   }]
  // };

  let appendListener = function (message, endPos, id, matchers) {
    if (message) {
      let matches = matchers.map(function (m) {
        let result = message.match(m.regex);
        return {
          name: m.name,
          regex: m.regex,
          count: result ? result.length : 0
        };
      });
      let updateMatchers = matches.map(function (mr) {
        return {
          query: {
            id,
            'matchers.name': mr.name
          },
          update: {
            $inc: {
              total: mr.count,
              'matchers.$.count': mr.count
            },
            $set: {
              endPos
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
  };

  let errorListener = function (err) {
    throw err;
  };

  mongoose.model('Watcher').find(function (err, docs) {
    if (err) {
      throw err;
    }
    if (docs && docs.length > 0) {
      logger.instance.info('{} watchers found. Initializing');
      let wLength = docs.length;
      for (let i = 0; i < wLength; i++) {
        let watcher = docs[i];
        AppendWatcher.watch(watcher)
          .on('append', appendListener)
          .on('error', errorListener);
      }
    } else {
      logger.instance.info('No watchers found.');
    }
  });
};

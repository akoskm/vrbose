import mongoose from 'mongoose';
import AppendWatcher from './appendwatcher';
import { logger } from './util/logger';

export default(watcherFactory) => {
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
  if (watcherFactory === null || watcherFactory === undefined) {
    throw 'WatcherFactory is empty';
  }

  // this much parameters horrible
  let appendListener = function (matches, endPos, id, matchers) {
    if (matches) {
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
        if (watcher) {
          AppendWatcher.watch(watcher, watcherFactory)
            .on('append', appendListener)
            .on('error', errorListener);
        }
      }
    } else {
      logger.instance.info('No watchers found.');
    }
  });
};

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

  let appendListener = function (matches, endPos, id, socket) {
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
              endPos,
              'matchers.$.lastMatch': Date.now()
            }
          }
        };
      });
      updateMatchers.forEach(function (um) {
        let total = um.update.$inc.total;
        if (total > 0) {
          let matcherHistory = {
            total
          };
          mongoose.model('MatcherHistory').create(matcherHistory, function (err, history) {
            if (err) throw err;
            um.update.$push = {
              'matchers.$.history': history
            };
            if (socket !== null) {
              socket.emit('message', {
                name: um.query['matchers.name'],
                history
              });
            }
            mongoose.model('Watcher').update(um.query, um.update, function (err, watcher) {
              if (err) throw err;
            });
          });
        }
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
          AppendWatcher.watch(watcher)
            .on('append', appendListener)
            .on('error', errorListener);
        }
      }
    } else {
      logger.instance.info('No watchers found.');
    }
  });
};

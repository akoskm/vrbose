import mongoose from 'mongoose';
import AppendWatcher from './appendwatcher';

export default() => {
  let newWatcherCfg = {
    id: 'INFO_AND_ERROR',
    path: '.',
    name: 'INFO and ERROR',
    description: 'Watch for [INFO] and [ERROR] occurance in this file',
    filename: 'myfile1.txt',
    matchers: [{
      name: 'INFO',
      regex: /\[INFO\]/
    }, {
      name: 'ERROR',
      regex: /\[ERROR\]/
    }]
  };

  mongoose.model('Watcher').find(function (err, docs) {
    if (err) {
      throw err;
    }
    if (!docs || docs.length < 1) {
      mongoose.model('Watcher').create(newWatcherCfg, function (err, doc) {
        if (err) throw err;
        console.log(doc);
      });
    }
    let watcher = docs[0];

    const appendWatcher = AppendWatcher.watch(watcher.filename, watcher.endPos);
    let counter = 0;
    appendWatcher
      .on('append', function (message, endPos) {
        if (message) {
          let matches = newWatcherCfg.matchers.map(function (m) {
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
                id: newWatcherCfg.id,
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
      })
      .on('error', function (err) {
        throw err;
      });
  });
};

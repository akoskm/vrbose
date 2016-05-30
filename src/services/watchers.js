import { logger } from '../util/logger';

import moment from 'moment';
import fs from 'fs';
import workflowFactory from '../util/workflow';
import mongoose from 'mongoose';

const watcherApi = {

  list(req, res, next) {
    const workflow = workflowFactory(req, res);

    workflow.on('getWatchers', function () {
      mongoose.model('Watcher').find({}, function (err, doc) {
        if (err) {
          logger.instance.error('Error while fetching watchers', err);
          workflow.outcome.errors.push('Cannot fetch watchers');
          return workflow.emit('response');
        }

        workflow.outcome.result = doc;
        return workflow.emit('response');
      });
    });

    workflow.emit('getWatchers');
  },

  find(req, res, next) {
    const workflow = workflowFactory(req, res);
    let startOfDay = moment().subtract(1, 'days');
    let endOfDay = moment();

    if (req.query.d && moment(req.query.d, 'YYYY-MM-DD')) {
      startOfDay = moment(req.query.d).startOf('day');
      endOfDay = moment(req.query.d).endOf('day');
    }

    workflow.on('findWatcher', function () {
      mongoose.model('Watcher')
        .findById(req.params.id, function (err, watcher) {
          let matchers = watcher.matchers;
          if (matchers && matchers.length > 0) {
            mongoose.model('MatcherHistory').find({
              matcher: { $in : matchers },
              createdOn: { $gte: startOfDay, $lt: endOfDay }
            }).sort({ createdOn: 1 }).exec(function (err, history) {
              if (err) {
                logger.instance.error('Error while fetching watchers', err);
                workflow.outcome.errors.push('Cannot fetch watchers');
                return workflow.emit('response');
              }

              let result = watcher.toJSON();
              if (history && history.length > 0) {
                let matcherWithHistory = matchers.map(function (m) {
                  let withHistory = m.toJSON();
                  withHistory.history = history.filter(function (h) {
                    return m._id.equals(h.matcher);
                  });
                  return withHistory;
                });
                result.matchers = matcherWithHistory;
              }

              workflow.outcome.result = result;
              return workflow.emit('response');
            });
          } else {
            workflow.outcome.result = watcher;
            return workflow.emit('response');
          }
        });
    });

    workflow.emit('findWatcher');
  },

  activity(req, res, next) {
    const workflow = workflowFactory(req, res);

    workflow.on('findActivities', function () {
      mongoose.model('MatcherHistory').aggregate({
        $group: {
          _id: {
            day: { $dayOfYear: '$createdOn' },
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } }
          },
          total: { $sum: '$total' }
        }
      }, function (err, docs) {
        if (err) throw err;
        let result = {
          activites: [],
          max: 0
        };
        if (docs && docs.length > 0) {
          result.activites = docs.map(function (d) {
            if (d.total > result.max) result.max = d.total;
            return {
              date: d._id.date,
              total: d.total
            };
          });
        }
        workflow.outcome.result = result;
        workflow.emit('response');
      });
    });

    workflow.emit('findActivities');
  }
};

export { watcherApi };

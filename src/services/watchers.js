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

    workflow.on('findWatcher', function () {
      mongoose.model('Watcher')
        .findById(req.params.id)
        .populate('matchers.history')
        .sort({ 'matchers.history': 1 })
        .slice('matchers.history', [0, 50])
        .exec(function (err, doc) {
          if (err) {
            logger.instance.error('Error while fetching watchers', err);
            workflow.outcome.errors.push('Cannot fetch watchers');
            return workflow.emit('response');
          }

          workflow.outcome.result = doc;
          return workflow.emit('response');
        });
    });

    workflow.emit('findWatcher');
  },

  getMatcherHistory(req, res, next) {
    const workflow = workflowFactory(req, res);

    workflow.on('findMatcher', function () {
      let query = {
        matcher: req.params.matcherId
      };

      if (req.query.d && moment(req.query.d, 'YYYY-MM-DD')) {
        let startOfDay = moment(req.query.d).startOf('day');
        let endOfDay = moment(req.query.d).endOf('day');
        console.log(startOfDay, endOfDay);
        query.createdOn = {
          $gte: startOfDay,
          $lt: endOfDay
        };
      }

      mongoose.model('MatcherHistory')
        .find(query)
        .sort({ createdOn: 1 })
        .limit(50)
        .exec(function (err, doc) {
          if (err) throw err;
          if (doc) workflow.outcome.result = doc;
          workflow.emit('response');
        });
    });

    workflow.emit('findMatcher');
  },

  getHistory(req, res, next) {
    const workflow = workflowFactory(req, res);
    const start = moment().startOf('day');

    workflow.on('findWatcher', function () {
      mongoose.model('Watcher')
        .findById(req.params.id)
        .select('matchers')
        .exec(function (err, doc) {
          if (err) throw err;
          if (doc) {
            let matchers = doc.matchers;
            if (matchers && matchers.length > 0) {
              workflow.matchers = matchers;
              return workflow.emit('findMatcherHistory');
            }
          } else {
            workflow.emit('response');
          }
        });
    });

    workflow.on('findMatcherHistory', function () {
      mongoose.model('MatcherHistory')
        .find({
          matcher: { $in: workflow.matchers },
          createdOn: { $gt: start }
        })
        .count(function (err, doc) {
          if (err) throw err;
          workflow.outcome.result = [{
            date: start.format('YYYY-MM-DD'),
            count: doc
          }];
          workflow.emit('response');
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

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

  getHistory(req, res, next) {
    const workflow = workflowFactory(req, res);
    const start = moment().startOf('year');

    workflow.on('findWatcher', function () {
      mongoose.model('Watcher')
        .findById(req.params.id)
        .populate({
          path: 'matchers.history',
          match: { 'matchers.history.total': { $gte: 0 } }
        })
        .exec(function (err, doc) {
          if (err) throw err;
          workflow.outcome.result = doc.matchers;
          workflow.emit('response');
        });
    });

    workflow.emit('findWatcher');
  }
};

export { watcherApi };

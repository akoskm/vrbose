import { logger } from '../util/logger';

import fs from 'fs';
import workflowFactory from '../util/workflow';
import mongoose from 'mongoose';

const watcherApi = {

  getWatchers(req, res, next) {
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

  findWatcher(req, res, next) {
    const workflow = workflowFactory(req, res);

    workflow.on('findWatcher', function () {
      mongoose.model('Watcher')
        .findById(req.params.id)
        .populate('matchers.history')
        .slice('matchers.history', [0, 10])
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
  }
};

export { watcherApi };

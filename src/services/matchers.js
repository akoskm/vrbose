import { logger } from '../util/logger';

import moment from 'moment';
import fs from 'fs';
import workflowFactory from '../util/workflow';
import mongoose from 'mongoose';

const matcherApi = {

  update(req, res, next) {
    const workflow = workflowFactory(req, res);

    workflow.on('validate', function () {
      let matcher = req.body;
      if (!matcher) {
        workflow.outcome.errors.push('request is empty');
        return workflow.emit('response');
      } else {
        if (!matcher.name) {
          workflow.outcome.errors.push('Matcher name is required');
        }

        if (matcher.regex === null || matcher.regex === undefined || matcher.regex.length < 1) {
          workflow.outcome.errors.push('Matcher regex is required');
        }

        if (workflow.hasErrors()) {
          return workflow.emit('response');
        }

        workflow.matcher = matcher;
        return workflow.emit('update');
      }
    });

    workflow.on('update', function () {
      let query = {
        _id: req.params.watcherId,
        'matchers._id': req.params.id
      };
      let update = {
        $set: {
          'matchers.$.name': workflow.matcher.name,
          'matchers.$.regex': workflow.matcher.regex
        }
      };
      mongoose.model('Watcher').findOneAndUpdate(query, update, function (err, doc) {
        if (err) {
          logger.instance.error('Error while updating matcher', err);
          workflow.outcome.errors.push('Cannot update matcher');
          return workflow.emit('response');
        }

        workflow.outcome.result = doc;
        return workflow.emit('response');
      });
    });

    workflow.emit('validate');
  }
};

export { matcherApi };

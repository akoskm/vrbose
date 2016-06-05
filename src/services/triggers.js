import { logger } from '../util/logger';

import moment from 'moment';
import fs from 'fs';
import workflowFactory from '../util/workflow';
import mongoose from 'mongoose';

const triggerApi = {

  create(req, res, next) {
    const workflow = workflowFactory(req, res);

    workflow.on('validate', function () {
      let trigger = req.body;
      if (!trigger) {
        workflow.outcome.errors.push('request is empty');
        return workflow.emit('response');
      } else {
        if (!trigger.type) {
          workflow.outcome.errors.push('Type is required');
        }

        if (!trigger.recipient) {
          workflow.outcome.errors.push('Recipient is required');
        }

        if (workflow.hasErrors()) {
          return workflow.emit('response');
        }

        workflow.trigger = trigger;
        return workflow.emit('create');
      }
    });

    workflow.on('create', function () {
      let update = {
        $push: {
          triggers: {
            type: workflow.trigger.type,
            recipient: workflow.trigger.recipient
          }
        }
      };
      mongoose.model('Watcher').findByIdAndUpdate(
        req.params.watcherId,
        update,
        function (err, doc) {
          if (err) {
            logger.instance.error('Error while creating trigger', err);
            workflow.outcome.errors.push('Cannot create trigger');
            return workflow.emit('response');
          }

          workflow.outcome.result = doc;
          return workflow.emit('response');
        });
    });

    workflow.emit('validate');
  },

  update(req, res, next) {
    const workflow = workflowFactory(req, res);

    workflow.on('validate', function () {
      let trigger = req.body;
      if (!trigger) {
        workflow.outcome.errors.push('request is empty');
        return workflow.emit('response');
      } else {
        if (!trigger.type) {
          workflow.outcome.errors.push('Type is required');
        }

        if (!trigger.recipient) {
          workflow.outcome.errors.push('Recipient is required');
        }

        if (workflow.hasErrors()) {
          return workflow.emit('response');
        }

        workflow.trigger = trigger;
        return workflow.emit('update');
      }
    });

    workflow.on('update', function () {
      let query = {
        _id: req.params.watcherId,
        'triggers._id': req.params.id
      };
      let update = {
        $set: {
          'triggers.$.type': workflow.trigger.type,
          'triggers.$.recipient': workflow.trigger.recipient
        }
      };
      mongoose.model('Watcher').findOneAndUpdate(query, update, function (err, doc) {
        if (err) {
          logger.instance.error('Error while updating trigger', err);
          workflow.outcome.errors.push('Cannot update trigger');
          return workflow.emit('response');
        }

        workflow.outcome.result = doc;
        return workflow.emit('response');
      });
    });

    workflow.emit('validate');
  }
};

export { triggerApi };

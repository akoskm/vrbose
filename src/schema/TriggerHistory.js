import mongoose from 'mongoose';

let triggerHistorySchema = new mongoose.Schema({
  trigger: { type: mongoose.Schema.Types.ObjectId, ref: 'Watcher.triggers' },
  createdOn: { type: Date, required: true, default: Date.now }
});
triggerHistorySchema.set('autoIndex', (process.env.NODE_ENV === 'development'));

mongoose.model('TriggerHistory', triggerHistorySchema);

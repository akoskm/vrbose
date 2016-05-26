import mongoose from 'mongoose';

let watcherSchema = new mongoose.Schema({
  id: { type: String, require: true, unique: true, index: true },
  path: { type: String, required: true, default: '.' },
  filename: { type: String, required: true },
  name: { type: String, required: true, default: 'New Watcher' },
  description: { type: String, default: '' },
  total: { type: Number, required: true, default: 0 },
  endPos: { type: Number, required: true, default: 0 },
  matchers: [{
    name: { type: String, required: true, unique: true },
    regex: { type: String, required: true },
    count: { type: Number, required: true, default: 0 },
    createdOn: { type: Date, required: true, default: Date.now },
    lastMatch: { type: Date }
  }],
  createdOn: { type: Date, required: true, default: Date.now },
  createdBy: { type: String, required: true, default: 'unknown' },
  editedOn: { type: Date },
  editedBy: { type: String }
});
watcherSchema.set('autoIndex', (process.env.NODE_ENV === 'development'));

mongoose.model('Watcher', watcherSchema);

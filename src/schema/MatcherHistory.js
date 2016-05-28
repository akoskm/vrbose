import mongoose from 'mongoose';

let matcherHistorySchema = new mongoose.Schema({
  total: { type: Number, required: true, default: 0 },
  createdOn: { type: Date, required: true, default: Date.now }
});
matcherHistorySchema.set('autoIndex', (process.env.NODE_ENV === 'development'));

mongoose.model('MatcherHistory', matcherHistorySchema);

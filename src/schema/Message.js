import mongoose from 'mongoose';

export default(autoIndex) => {

  let MessageSchema = new mongoose.Schema({
    data: {},
    level: { type: String, default: 'INFO' },
    topic: { type: String, default: '' },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String, default: '' }
  });

  MessageSchema.set('autoIndex', autoIndex);

  return MessageSchema;
};

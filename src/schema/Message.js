import mongoose from 'mongoose';

export default(autoIndex) => {

  let messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    level: { type: String, default: 'INFO' },
    topic: { type: String, default: 'default' },
    timestamp: { type: Date, default: Date.now },
    author: { type: String, default: 'unknown' }
  });

  messageSchema.set('autoIndex', autoIndex);

  mongoose.model('Message', messageSchema);
};

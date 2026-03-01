import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudySession', required: true },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productivityRating: { type: Number, min: 1, max: 5, required: true },
    cooperationRating: { type: Number, min: 1, max: 5, required: true },
    comments: String
  },
  { timestamps: true }
);

export default mongoose.model('Feedback', FeedbackSchema);

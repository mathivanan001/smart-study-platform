import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyGroup', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: String,
    fileUrl: String,
    note: String
  },
  { timestamps: true }
);

export default mongoose.model('Message', MessageSchema);

import mongoose from 'mongoose';

const StudyGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    rules: [String],
    subjects: [String],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    maxMembers: { type: Number, default: 8, min: 2, max: 50 },
    isClosed: { type: Boolean, default: false },
    announcements: [
      {
        text: { type: String, required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    callRoom: {
      roomId: String,
      callType: { type: String, enum: ['audio', 'video'] },
      callUrl: String,
      startedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      startedAt: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model('StudyGroup', StudyGroupSchema);

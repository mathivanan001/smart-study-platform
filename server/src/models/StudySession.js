import mongoose from 'mongoose';

const StudySessionSchema = new mongoose.Schema(
  {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyGroup', required: true },
    topic: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    studyHours: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('StudySession', StudySessionSchema);

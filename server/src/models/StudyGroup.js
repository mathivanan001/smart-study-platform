import mongoose from 'mongoose';

const StudyGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    rules: [String],
    subjects: [String],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model('StudyGroup', StudyGroupSchema);

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subjects: [{ type: String }],
    availability: [{ day: String, from: String, to: String }],
    studyStyle: {
      type: String,
      enum: ['solo-first', 'discussion-heavy', 'problem-solving', 'visual-learning'],
      default: 'discussion-heavy'
    },
    goals: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);

import mongoose from 'mongoose';

const getHelpfulMongoUriError = (mongoUri) => {
  try {
    // This catches malformed connection strings early and gives actionable feedback.
    // eslint-disable-next-line no-new
    new URL(mongoUri);
    return null;
  } catch {
    return 'MONGO_URI is not a valid URI. Ensure it starts with mongodb:// or mongodb+srv:// and that special characters in usernames/passwords are URL-encoded.';
  }
};

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is required. Add it to server/.env');
  }

  const uriError = getHelpfulMongoUriError(mongoUri);
  if (uriError) throw new Error(uriError);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log('MongoDB connected');
  } catch (error) {
    const message = error?.message || 'Unknown MongoDB connection error';
    if (message.includes('URI malformed') || message.includes('Invalid scheme')) {
      throw new Error(
        `${message}. If your MongoDB password contains characters like '@', '#', or ':', URL-encode them (e.g. '@' becomes '%40').`
      );
    }
    throw new Error(`MongoDB connection failed: ${message}`);
  }
};

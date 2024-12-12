import mongoose from 'mongoose';

export const connectDB = async (mongoURL: string | undefined): Promise<void> => {
  try {
    if (!mongoURL) {
        throw new Error("Missing Mongo DB URL");
    }
    await mongoose.connect(mongoURL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

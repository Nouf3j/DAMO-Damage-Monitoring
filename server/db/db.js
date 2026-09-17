import mongoose from 'mongoose';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('Database connection error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectToDatabase;
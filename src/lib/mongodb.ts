import mongoose from 'mongoose';

let connection: typeof mongoose | null = null;

async function connectToDatabase() {
  if (connection) {
    return connection;
  }

  const MONGODB_URI = process.env.MONGODB_URI as string;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  try {
    connection = await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default connectToDatabase;
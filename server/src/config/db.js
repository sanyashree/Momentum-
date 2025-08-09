import mongoose from 'mongoose';

export async function connectToDatabase() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/momentum';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { autoIndex: true });
  console.log('MongoDB connected');
}



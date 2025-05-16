import mongoose from "mongoose";

const connectDB = async () =>  {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database connected at ${mongoose.connection.host}`);
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

export default connectDB;
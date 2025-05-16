import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://BugSlayers:Bugs123@cluster0.6b35ux2.mongodb.net',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

export default connectDB;

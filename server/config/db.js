const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const connector = await mongoose.connect(process.env.MONGODB_URI); // connection should works due to vs code extensions
    console.log(`Database Connected to: ${connector.connection.host}`);
  } catch (e) {
    console.log("connection error:", e);
  }
};

module.exports = connectDB;

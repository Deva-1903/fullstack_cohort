const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(password);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.log("Error in MongoDB connection", JSON.stringify(error));
    process.exit(1);
  }
};

module.exports = connectDB
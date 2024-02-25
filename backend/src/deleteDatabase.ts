const mongoose = require('mongoose');
const { Channel } = require("./models/channels.model");
const { Message } = require("./models/messages.model");
const { Guest } = require("./models/guests.model");
const { User } = require("./models/users.model");
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const clearDatabase = async () => {
  try {
    // Remove all documents from each collection
    await User.deleteMany({});
    await Guest.deleteMany({});
    await Channel.deleteMany({});
    await Message.deleteMany({});

    console.log('Database cleared successfully!');
  } catch (error) {
    console.error('Error clearing the database:', error);
  } finally {
    mongoose.disconnect();
  }
};

clearDatabase();
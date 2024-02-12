import { dot } from "node:test/reporters";

const mongoose = require("mongoose");
const { Channel } = require("./models/channels.model");
const { Message } = require("./models/messages.model");
const { Guest } = require("./models/guests.model");
const { User } = require("./models/users.model");
const faker = require("faker");
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createFakeData = async () => {
  try {
    // Define how many fake entries you want
    const numberOfGuests = 10;
    const numberOfUsers = 10;
    const numberOfChannels = 20;
    const messagesPerChannel = 50;

    // Create fake users
    for (let i = 0; i < numberOfUsers; i++) {
      const user = new User({
        username: faker.internet.userName(),
        channels: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, () =>
          faker.company.companyName()
        ),
        informations: faker.lorem.sentence(),
        createdAt: faker.date.past(),
      });

      await user.save();

    // Create fake guests
    for (let i = 0; i < numberOfGuests; i++) {
      const guest = new Guest({
        username: faker.internet.userName(),
        channels: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, () =>
          faker.company.companyName()
        ),
        lastConnexion: faker.date.past(),
      });

      await guest.save();

    for (let i = 0; i < numberOfChannels; i++) {
      // Create a fake channel
      const channel = new Channel({
        name: faker.company.companyName(),
        members: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, () =>
          guest._id,
        ),
        visibility: faker.random.arrayElement(["public", "private"]),
      });

      await channel.save();

      // Create fake messages for the channel
      for (let j = 0; j < messagesPerChannel; j++) {
        const message = new Message({
          text: faker.lorem.sentence(),
          channelId: channel._id,
          authorId: faker.name.findName(),
          timestamp: faker.date.past(),
        });

        await message.save();
        }
      }
    }
  }

    console.log("Fake data generation complete!");
  } catch (error) {
    console.error("Error generating fake data:", error);
  }
};

createFakeData().then(() => mongoose.disconnect());
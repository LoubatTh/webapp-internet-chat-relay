const mongoose = require("mongoose");
const { Channel } = require("./models/channels.model");
const { Message } = require("./models/messages.model");
const { Guest } = require("./models/guests.model");
const { User } = require("./models/users.model");
const faker = require("faker");
import dotenv from "dotenv";
import _ from 'lodash';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createFakeData = async () => {
  try {
    // Define how many fake entries you want
    const numberOfGuests = 15;
    const numberOfUsers = 15;
    const numberOfChannels = 50;
    const messagesPerChannel = 250;

    const userIDs = [];
    const guestIDs = [];

    // Create fake users
    for (let i = 0; i < numberOfUsers; i++) {
      const user = new User({
        username: faker.internet.userName(),
        channels: generateRandomChannels(),
        pmsgs: generateRandomChannels(),
        password: faker.internet.password(),
        informations: faker.lorem.sentence(),
        createdAt: faker.date.past(),
      });

      await user.save();
      userIDs.push(user._id);
    }

    // Create fake guests
    for (let i = 0; i < numberOfGuests; i++) {
      const guest = new Guest({
        username: faker.internet.userName(),
        channels: generateRandomChannels(),
        pmsgs: generateRandomChannels(),
        lastConnexion: faker.date.past(),
      });

      await guest.save();
      guestIDs.push(guest._id);
    }

    for (let i = 0; i < numberOfChannels; i++) {
      // Create a fake channel
      const words = faker.lorem.words(faker.datatype.number({ min: 1, max: 3 }));
      const channelName = words.split(' ').join('-');
      const channel = new Channel({
        name: channelName,
        members: generateRandomMembers(userIDs, guestIDs),
        visibility: faker.random.arrayElement(["public", "private"]),
      });

      const owner = faker.random.arrayElement(channel.members);
      channel.owner = owner;

      await channel.save();

      // Create fake messages for the channel
      for (let j = 0; j < messagesPerChannel; j++) {
        const message = new Message({
          text: faker.lorem.sentence(),
          channelId: channel._id,
          authorId: faker.random.arrayElement([...userIDs, ...guestIDs]),
          timestamp: faker.date.past(),
        });

        await message.save();
      }
    }

    console.log("Fake data generation complete!");
  } catch (error) {
    console.error("Error generating fake data:", error);
  } finally {
    mongoose.disconnect();
  }
};

// Helper function to generate random channels for users and guests
const generateRandomChannels = () => {
  const words = faker.lorem.words(faker.datatype.number({ min: 1, max: 3 }));
  return words.split(' ').join('-');
};

// Helper function to generate random members for a channel
const generateRandomMembers = (userIDs: any[], guestIDs: any[]) => {
  return Array.from({ length: faker.datatype.number({ min: 1, max: 8 }) }, () =>
    faker.random.arrayElement(_.shuffle([...userIDs, ...guestIDs]))
  );
};

const createSystemUser = async() => {
  const userAdmin = new User({
    _id: "65db5d8c1dc68d78ca5801d4",
    username: "System_Notification",
    channels: [],
    pmsgs: [],
    password: faker.internet.password(),
    informations: "Super Administrator, do not disturb !",
    createdAt: faker.date.past(),
  });

  await userAdmin.save();
}

createSystemUser();
createFakeData();
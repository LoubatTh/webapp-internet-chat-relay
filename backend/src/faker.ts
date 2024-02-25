const mongoose = require("mongoose");
const { Channel } = require("./models/channels.model");
const { Message } = require("./models/messages.model");
const { Guest } = require("./models/guests.model");
const { User } = require("./models/users.model");
const faker = require("faker");
import dotenv from "dotenv";
import _ from "lodash";

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
    const numberOfUsers = 1;
    const numberOfChannels = 15;
    const messagesPerChannel = 50;

    const userIDs: any[] = [];
    const guestIDs: any[] = [];

    // Create fake users
    for (let i = 0; i < numberOfUsers; i++) {
      const user = new User({
        username: faker.internet.userName(),
        channels: Array.from(
          { length: faker.datatype.number({ min: 1, max: 10 }) },
          () => faker.company.companyName()
        ),
        pmsgs: Array.from(
          { length: faker.datatype.number({ min: 1, max: 10 }) },
          () => faker.company.companyName()
        ),
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
        channels: Array.from(
          { length: faker.datatype.number({ min: 1, max: 10 }) },
          () => faker.company.companyName()
        ),
        pmsgs: Array.from(
          { length: faker.datatype.number({ min: 1, max: 10 }) },
          () => faker.company.companyName()
        ),
        lastConnexion: faker.date.past(),
      });

      await guest.save();
      guestIDs.push(guest._id);
    }

    for (let i = 0; i < numberOfChannels; i++) {
      // Create a fake channel
      const words = faker.lorem.words(
        faker.datatype.number({ min: 1, max: 3 })
      );
      const channelName = words.split(" ").join("-");
      const channel = new Channel({
        // Concatène les mots pour créer le nom du canal sans espaces
        name: channelName,
        members: Array.from(
          { length: faker.datatype.number({ min: 1, max: 8 }) },
          () => faker.random.arrayElement(_.shuffle([...userIDs, ...guestIDs]))
        ),
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

createFakeData();

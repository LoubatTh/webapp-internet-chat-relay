const mongoose = require("mongoose");
const { Channel } = require("./models/channels.model"); // Adjust the path as necessary
const { Message } = require("./models/messages.model"); // Adjust the path as necessary
const faker = require("faker");

// Connect to MongoDB
mongoose.connect("mongodb+srv://user-db:Rmh1Z8aNNTaXVMPt@cluster0.kmky613.mongodb.net/Epichat?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createFakeData = async () => {
  try {
    // Define how many fake entries you want
    const numberOfChannels = 20;
    const messagesPerChannel = 200;

    for (let i = 0; i < numberOfChannels; i++) {
      // Create a fake channel
      const channel = new Channel({
        name: faker.company.companyName(),
        members: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, () =>
          faker.internet.email()
        ),
        visibility: faker.random.arrayElement(["public", "private", "hidden"]),
      });

      await channel.save();

      // Create fake messages for the channel
      for (let j = 0; j < messagesPerChannel; j++) {
        const message = new Message({
          text: faker.lorem.sentence(),
          channelId: channel._id,
          author: faker.name.findName(),
          timestamp: faker.date.past(),
        });

        await message.save();
      }
    }

    console.log("Fake data generation complete!");
  } catch (error) {
    console.error("Error generating fake data:", error);
  }
};

createFakeData().then(() => mongoose.disconnect());
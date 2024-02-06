import mongoose from 'mongoose';
import { Channel } from '~/models/channels.model';
import { User } from '~/models/users.model';
import { Message } from '~/models/messages.model';

//TODO: Verifier que les données ne sont pas en doublant dans la base de données

// Connexion à MongoDB
mongoose
  .connect("mongodb+srv://user-db:Rmh1Z8aNNTaXVMPt@cluster0.kmky613.mongodb.net/Epichat", { })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err}`);
    process.exit(1);
  });

const db = mongoose.connection;

// Gestion des événements de connexion MongoDB
db.on('error', (err) => {
  console.error(`Erreur de connexion à MongoDB: ${err}`);
  process.exit(1);
});

db.once('open', async () => {
  console.log('Connexion à MongoDB établie avec succès!');

  // Ajoutez des données à la collection "channels"
  const channelsData = [
    { name: 'channel1pub' , visibility: 'public', members: ['user1', 'user2', 'user3', 'user4', 'user5']},
    { name: 'channel2pub' , visibility: 'public', members: ['user1', 'user2', 'user3', 'user4', 'user5']},
    { name: 'channel3pub' , visibility: 'public', members: ['user1', 'user2', 'user3', 'user4', 'user5']},
    { name: 'channel4pub' , visibility: 'public', members: ['user1', 'user2', 'user3', 'user4', 'user5']},
    { name: 'channel5pub' , visibility: 'public', members: ['user1', 'user2', 'user3', 'user4', 'user5']},
    { name: 'channel6pub' , visibility: 'public', members: ['user1', 'user2', 'user3', 'user4', 'user5']},
    { name: 'channel7pub' , visibility: 'public', members: ['user1', 'user2', 'user3', 'user4', 'user5']},
    { name: 'channel8pub' , visibility: 'public', members: ['user1', 'user2', 'user3', 'user4', 'user5']},
    { name: 'channel9pub' , visibility: 'public', members: ['user1', 'user2', 'user3', 'user4', 'user5']},
    { name: 'channel10pub' , visibility: 'public', members: ['user1', 'user2', 'user3', 'user4', 'user5']},
    { name: 'channel11pub' , visibility: 'public', members: ['user1', 'user2', 'user3', 'user4', 'user5']},
    { name: 'channel12pub' , visibility: 'public', members: ['user1', 'user2', 'user3', 'user4', 'user5']},
    { name: 'channel13pub' , visibility: 'public', members: ['user1', 'user2', 'user3', 'user4', 'user5']},
    { name: 'channel14pub' , visibility: 'public', members: ['user1', 'user2', 'user3', 'user4', 'user5']},
    { name: 'channel15pub' , visibility: 'public', members: ['user1', 'user2', 'user3', 'user4', 'user5']},
    { name: 'channel16pub' , visibility: 'public', members: ['user1', 'user2', 'user3', 'user4', 'user5']},
    { name: 'channel17priv' , visibility: 'private', members: ['user4']},
    { name: 'channel18priv' , visibility: 'private', members: ['user4']},
    { name: 'channel19priv' , visibility: 'private', members: ['user4']},
    { name: 'channel20priv' , visibility: 'private', members: ['user4']},
    { name: 'channel21priv' , visibility: 'private', members: ['user5']},
    { name: 'channel22priv' , visibility: 'private', members: ['user5']}
  ];

  const usersData = [
    { username : 'user1' , channels: ['channel1pub', 'channel2pub', 'channel3pub', 'channel4pub', 'channel5pub'], informations: 'informatons'},
    { username : 'user2' , channels: ['channel6pub', 'channel7pub', 'channel8pub', 'channel9pub', 'channel10pub'], informations: 'informatons'},
    { username : 'user3' , channels: ['channel11pub', 'channel12pub', 'channel13pub', 'channel14pub', 'channel15pub'], informations: 'informatons'},
    { username : 'user4' , channels: ['channel16pub', 'channel17priv', 'channel18priv', 'channel19priv', 'channel20priv'], informations: 'informatons'},
    { username : 'user5' , channels: ['channel21priv', 'channel22priv'], informations: 'informatons'}
  ];

  const messagesData = [
    { text: 'message1' , channelId: '65c29168b1ef82e2f1ccee92', author: 'user1'},
    { text: 'message2' , channelId: '65c29168b1ef82e2f1ccee92', author: 'user2'},
    { text: 'message3' , channelId: '65c29168b1ef82e2f1ccee92', author: 'user3'},
    { text: 'message4' , channelId: '65c29168b1ef82e2f1ccee92', author: 'user4'},
    { text: 'message5' , channelId: '65c29168b1ef82e2f1ccee92', author: 'user5'},
    { text: 'message6' , channelId: '65c29168b1ef82e2f1ccee92', author: 'user1'},
    { text: 'message7' , channelId: '65c29168b1ef82e2f1ccee92', author: 'user2'},
    { text: 'message8' , channelId: 'channel2pub', author: 'user3'},
    { text: 'message9' , channelId: 'channel2pub', author: 'user4'},
    { text: 'message10' , channelId: 'channel2pub', author: 'user5'},
    { text: 'message11' , channelId: 'channel3pub', author: 'user1'},
    { text: 'message12' , channelId: 'channel3pub', author: 'user2'},
    { text: 'message13' , channelId: 'channel3pub', author: 'user3'},
    { text: 'message14' , channelId: 'channel3pub', author: 'user4'},
    { text: 'message15' , channelId: 'channel3pub', author: 'user5'},
    { text: 'message16' , channelId: 'channel4pub', author: 'user1'},
    { text: 'message17' , channelId: 'channel4pub', author: 'user2'},
    { text: 'message18' , channelId: 'channel4pub', author: 'user3'},
    { text: 'message19' , channelId: 'channel4pub', author: 'user4'},
    { text: 'message20' , channelId: 'channel4pub', author: 'user5'},
    { text: 'message21' , channelId: 'channel5pub', author: 'user1'},
    { text: 'message22' , channelId: 'channel5pub', author: 'user2'}
  ];

  try {
    // Utilisez le modèle Channel pour insérer des données dans la collection "channels"
    await Channel.insertMany(channelsData);
    await User.insertMany(usersData);
    await Message.insertMany(messagesData);
    console.log('Données ajoutées avec succès!');
  } catch (error) {
    console.error(`Erreur lors de l'ajout des données channels: ${error}`);
  } finally {
    // Fermez la connexion MongoDB
    db.close();
  }
});


// Gestion de l'événement de déconnexion MongoDB
db.on('close', () => {
  console.log('Connexion à MongoDB fermée.');
});
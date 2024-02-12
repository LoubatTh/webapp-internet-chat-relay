const fetch = require('node-fetch');
const { User } = require('../models/users.model');

export const getAuthorById = async (id: string) => {
  const
    user = await User.findById(id),
    username = user ? user.username : 'Unknown';
    return username;
}
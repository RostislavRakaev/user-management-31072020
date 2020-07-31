const User = require('../models/user.model');

module.exports = async () => {
  const seedUsers = [
    { firstName: 'Default', lastName: 'Defaultson', email: 'def@somemail.com', role: 'ARTIST', },
    { firstName: 'Success', lastName: 'Doe', email: 'john@example.com', role: 'DESIGNER', },
    { firstName: 'Danger', lastName: 'Moe', email: 'mary@example.com', role: 'ART_MANAGER', },
    { firstName: 'Info', lastName: 'Dooley', email: 'july@example.com', role: 'DESIGNER', },
    { firstName: 'Warning', lastName: 'Refs', email: 'bo@example.com', role: 'ARTIST', },
    { firstName: 'Active', lastName: 'Activeson', email: 'act@example.com', role: 'DESIGNER', },
  ];
  const users = await User.find({});
  console.log('Available users: ', users.length);
  if (!!users && users.length === 0) {
    console.log('Database seeding...');
    for (user of seedUsers) {
      const user = new User(user);
      user.save();
    }
    console.log('Database seeded', await User.find({}));
  }
}

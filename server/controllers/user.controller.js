var User = require('../models/user.model');

exports.findAll = (async (req, res) => {
  try {
    const users = await User.find({})
    res.json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

exports.create = (async (req, res) => {
  const newUser = new User(req.body);
  try {
    const user = await newUser.save();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(422).json({ error })
  }

})

exports.update = (async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(422).send(error);
  }
});

exports.delete = (async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).remove();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

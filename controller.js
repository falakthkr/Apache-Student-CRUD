const Student = require("../models/student");

const getUsers = (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
};

const addUser = (req, res) => {
  const username = req.body.username;
  const newUser = new User({ username });

  newUser
    .save()
    .then(() => res.json("User Added Successfully"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = {getUsers, addUser};
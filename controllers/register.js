/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const User = require('../../models/User');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  const { firstName, lastName, phone, email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (user) {
    return res.status(409).json({ error: 'User already exists' });
  } else {
    const newUser = new User({
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      phone: phone,
      email: email.toLowerCase(),
      password,
    });

    // Hash password
    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;

        // Save user
        newUser
          .save()
          .then((user) => {
            res.status(201).json({ message: 'User created' });
            console.log(user);
          })
          .catch((err) => console.log(err));
      })
    );
  }
};

const getRegister = (req, res) => {
  return res.status(200).send('View register');
};

module.exports = {
  registerUser,
  getRegister,
};

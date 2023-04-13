const router = require("express").Router();

const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//REGISTER ROUTE FOR USERS
router.post("/register", async (req, res) => {
  //Validation before create a new user
  const { error } = registerValidation(req.body); //Fn from line 4
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if the email already exists in the DB
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already exists!");

  //Hash the password
  const salt = await bcrypt.genSalt(10); //Package from line 6
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //Creating an user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  //Validation before create a new login
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if the user email exists in the DB
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or password don't match");

  //Check Password against our DB
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Password is incorrect");

  //Create and assign JsonwebToken
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token").send(token);

  res.send("LoggedIn");
});

module.exports = router;

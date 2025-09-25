const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// for user
async function registerUser(req, res) {
  const { fullname, email, password } = req.body;

  const userAlreadyExists = await userModel.findOne({ email });

  if (userAlreadyExists) {
    return res.status(400).json({
      message: "user already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullname,
    email,
    password: hashPassword,
  });

  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "user created succesfully",
    user: {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
    },
    token: token,
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      //   message: "invalid user or password",
      message: "user not exists",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "invalid user or password",
    });
  }

  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "user login succesfully!",
    user: {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
    },
    token: token,
  });
}

async function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "user logout succesfully!",
  });
}

// for food partner

async function registerFoodpartner(req, res) {
  const { email, name, password, contactName, phone, address } = req.body;

  const foodPartnerAlreadyExists = await foodPartnerModel.findOne({ email });

  if (foodPartnerAlreadyExists) {
    return res.status(400).json({
      message: "account already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const foodPartner = await foodPartnerModel.create({
    name,
    email,
    password: hashPassword,
    contactName,
    phone,
    address,
  });

  const token = jwt.sign(
    {
      _id: foodPartner._id,
    },
    process.env.JWT_SECRET
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "food partner created succesfully!",
    foodPartner: {
      _id: foodPartner._id,
      email: foodPartner.email,
      name: foodPartner.name,
      contactName: foodPartner.contactName,
      phone: foodPartner.phone,
      address: foodPartner.address,
    },
  });
}

async function loginFoodPartner(req, res) {
  const { email, password } = req.body;

  const foodPartner = await foodPartnerModel.findOne({ email });

  if (!foodPartner) {
    return res.status(400).json({
      message: "food partner not exists",
    });
  }

  const isPasswordValid = bcrypt.compare(password, foodPartner.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      _id: foodPartner._id,
    },
    process.env.JWT_SECRET
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "foodpartner created succesfully!",
    foodPartner: {
      _id: foodPartner._id,
      email: foodPartner.email,
      fullname: foodPartner.fullname,
    },
  });
}

async function logoutFoodPartner(req, res) {
  res.clearCookie("token");
  res.status(201).json({
    message: "food partner logout succescully!",
  });
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodpartner,
  loginFoodPartner,
  logoutFoodPartner,
};

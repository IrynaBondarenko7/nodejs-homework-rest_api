const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Jimp = require("jimp");
const path = require("path");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const crypto = require("node:crypto");

const User = require("../models/user");
const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");

const { SECRET_KEY, BASE_URL } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const regirter = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = crypto.randomUUID();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw new HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(404, "User not found");
  }
  if (user.verify) {
    throw new HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click verify email</a>`,
  };
  await sendEmail(verifyEmail);

  res.json({
    message: "Verify email send success",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(401, "Email or password invalid");
  }
  if (!user.verify) {
    throw new HttpError(401, "Email not verify");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw new HttpError(401, "Email or password invalid");
  }
  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({ token });
};

const getCurrent = async (req, res) => {
  const { email, name } = req.user;
  res.json({
    email,
    name,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).end();
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const updatedSubscription = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });
  if (!updatedSubscription) {
    throw new HttpError(404, "Not found");
  }
  res.json(updatedSubscription);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tmpUpload, originalname } = req.file;

  const fileName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, fileName);

  const image = await Jimp.read(tmpUpload);
  await image.resize(250, 250);
  await image.writeAsync(resultUpload);

  const newFileName = `resized_${fileName}`;
  const newResultUpload = path.join(avatarsDir, newFileName);
  await fs.rename(resultUpload, newResultUpload);
  const avatarURL = path.join("avatars", newFileName);

  await User.findByIdAndUpdate(_id, avatarURL);
  res.json({
    avatarURL,
  });
};

module.exports = {
  regirter: ctrlWrapper(regirter),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};

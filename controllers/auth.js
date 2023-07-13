const User = require("../models/user");

const { HttpError, ctrlWrapper } = require("../helpers");

const regirter = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new HttpError(409, "Email in use");
  }
  const newUser = await User.create(req.body);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

module.exports = {
  regirter: ctrlWrapper(regirter),
};

const User = require("../models/User");
const generateToken = require("../utils/generateJWT");

const registerNewUser = async ({ name, email, password, image }) => {
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error("User already exists with this email.");
  }

  // Strictly default to 'USER'. Admin should be seeded or manually set.
  const user = await User.create({
    name,
    email,
    password,
    image: image || undefined, // If no image is provided, Mongoose default will take over
  });

  if (user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      token: generateToken(user._id),
    };
  } else {
    throw new Error("Invalid user data.");
  }
};

const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email });

  // User model-e matchPassword function ta thaka dorkar (bcrypt compare)
  if (user && (await user.matchPassword(password))) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role, // Login er por frontend jeno bujhte pare eta admin dashboard naki normal user
      token: generateToken(user._id),
    };
  } else {
    throw new Error("Invalid email or password.");
  }
};

const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");
    return user;
  } catch (error) {
    throw new Error("User not found.");
  }
};

const logoutUser = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  };
};

const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Update fields (Email bad diye)
  if (updateData.name) user.name = updateData.name;
  if (updateData.image) user.image = updateData.image;

  // Password update logic
  if (updateData.password) {
    user.password = updateData.password;
  }

  const updatedUser = await user.save();

  return {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email, // Email change hobena, kintu response-e pathachchi
    image: updatedUser.image,
    role: updatedUser.role,
  };
};

const deleteUserAccountById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found or already deleted.");
  }

  // Permenently delete from database
  await user.deleteOne();

  return true;
};

module.exports = {
  registerNewUser,
  authenticateUser,
  getUserById,
  logoutUser,
  updateUserProfile,
  deleteUserAccountById,
};

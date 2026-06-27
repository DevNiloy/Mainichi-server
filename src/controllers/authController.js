const {
  registerNewUser,
  authenticateUser,
  getUserById,
  logoutUser,
  updateUserProfile,
} = require("../services/authService");

const setTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "strict",
  };
  res.cookie("jwt", token, cookieOptions);
};

/**
 * register user
 */
const registerUser = async (req, res, next) => {
  // request body theke image-o niye ashlam
  const { name, email, password, image } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields." });
  }

  try {
    // userData-te ekhon image-o thakbe
    const userData = await registerNewUser({ name, email, password, image });

    setTokenCookie(res, userData.token);

    res.status(201).json({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      image: userData.image, // response-e image pathalam
      role: userData.role,
      token: userData.token,
    });
  } catch (error) {
    if (error.message.includes("exists")) {
      res.status(400);
    } else {
      res.status(500);
    }
    next(error);
  }
};

/**
 * user login
 */
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please enter email and password." });
  }

  try {
    const userData = await authenticateUser(email, password);

    setTokenCookie(res, userData.token);

    // Login-er por image ebong role-o return korchi
    res.json({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      image: userData.image,
      role: userData.role,
      token: userData.token, // Admin naki user seta jante dorkar
    });
  } catch (error) {
    res.status(401);
    next(error);
  }
};

const getMe = async (req, res) => {
  try {
    // req.user.id (middleware theke asha) use kore data fetch
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// logout
const logout = async (req, res) => {
  // logic-ta sync hoyay async/await lagbe na
  const cookieOptions = await logoutUser();

  res.clearCookie("jwt", cookieOptions);
  res.status(200).json({ message: "Logged out successfully" });
};

const updateMe = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    let imagePath = req.body.image; // Purono image link jodi thake

    // Jodi Multer noutun file upload kore thake
    if (req.file) {
      // Public folder-er path jeta frontend theke access kora jabe
      imagePath = `/uploads/users/${req.file.filename}`;
    }

    const updatedData = await updateUserProfile(req.user._id, {
      name,
      image: imagePath,
      password,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedData,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe, logout, updateMe };

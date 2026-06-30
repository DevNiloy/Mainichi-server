const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Profile Image Field
    image: {
      type: String,
      default: "https://i.ibb.co/L8N81pX/default-avatar.png", // Default image URL
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true },
);

// Password match korar logic
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Fixed Pre-save Middleware
userSchema.pre("save", async function () {
  // Jodi password change na hoy, tobe kichu korar dorkar nei
  if (!this.isModified("password")) {
    return; // next() soriye return kora hoyeche
  }

  // Password hash korar logic
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userSchema);

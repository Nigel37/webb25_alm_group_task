const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Email must be a valid email address",
      },
    },
    profileImage: {
      type: String,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: "Profile image must be a valid URL",
      },
    },
  },
  { timestamps: true }
);

userSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const Accommodation = mongoose.model("Accommodation");
    await Accommodation.deleteMany({ userId: doc._id });
  }
});

module.exports = mongoose.model("User", userSchema);

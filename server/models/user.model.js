import mongoose, { Schema } from "mongoose";
import validator from "validator";
import argon2 from "argon2";

const { isStrongPassword, isEmail } = validator;

const userSchema = Schema(
  {
    name: {
      type: String,
      required: "Name is required!",
    },
    email: {
      type: String,
      required: "Email is required!",
      validate: [isEmail, "Please enter a valid email address!"],
      unique: true,
    },
    password: {
      type: String,
      required: "Password is required!",
      validate: {
        validator: function (p) {
          return isStrongPassword(this.password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: false,
            pointsPerUnique: 1,
            pointsPerRepeat: 0.5,
            pointsForContainingLower: 10,
            pointsForContainingUpper: 10,
            pointsForContainingNumber: 10,
            pointsForContainingSymbol: 10,
          });
        },
        message:
          "Password must be at least 8 characters, at least one upper case, one lower case, one number, and a special character",
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
      default: new Date(Date.now() + 30 * 60 * 1000),
      expires: "30m",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await argon2.hash(this.password);
    next();
  } catch (error) {
    next(error);
  }
});
userSchema.methods.comparePassword = async function (password) {
  try {
    return await argon2.verify(this.password, password);
  } catch (error) {
    console.error("Error while verifying the password!");
    return false;
  }
};

const User = mongoose.model("User", userSchema);
export default User;

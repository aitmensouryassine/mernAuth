import mongoose, { Mongoose, Schema } from "mongoose";
import validator from "validator";
import argon2 from "argon2";

const { isStrongPassword, isEmail } = validator;

/**
 * User Schema
 *
 * Defines the shape of the User documents in MongoDB
 * Includes fields for name, email, password, and email verification
 *
 * @typedef {Object} User
 * @property {string} name - User's full name
 * @property {string} email - User's email
 * @property {string} password - User's hashed password
 * @property {boolean} verified - Whether user's email is verified or not.
 * @property {string} verificationToken - Email verification token
 * @property {Date} verificationTokenExpires - Expiry date for the verification token
 */
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

/**
 * Mongoose pre-save middleware
 *
 * Hashes the password if modified before saving.
 *
 * @function
 * @name userSchema.pre("save")
 * @param {function} next - next middleware
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await argon2.hash(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compare a plain password with the hashed password
 *
 * @async
 * @function
 * @name comparePassword
 * @memberof User
 * @param {string} password - Plain password to verify
 * @returns {Promise<boolean>} - Returns true if password match and
 * false otherwise.
 */
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

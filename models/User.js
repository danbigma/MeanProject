const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: (props) => `${props.value} no es un correo electrónico válido!`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  timeLogin: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'USER', 'GUEST'],
    default: 'USER'
  },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number },
});

userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = mongoose.model("users", userSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  googleFavorites: [{
    bookId: String,
    title: String,
    authors: [String],
    image: String
  }],
  userFavorites: [{
    title: String,
    authors: [String],
    rating: { type: Number, default: 0 },  // Puan alanı
    review: { type: String, default: '' }  // Yorum alanı
  }]
});

// Şifreyi kaydetmeden önce hash işlemi yapılmasını sağlıyor
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;

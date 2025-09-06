const mongoose = require('mongoose');
const crypto = require('crypto');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  dateTime: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shareToken: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

eventSchema.pre('save', function(next) {
  if (!this.shareToken) {
    this.shareToken = crypto.randomBytes(16).toString('hex');
  }
  next();
});

eventSchema.index({ creator: 1, dateTime: 1 });

module.exports = mongoose.model('Event', eventSchema);
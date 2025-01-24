const mongoose = require('mongoose');

const YouTubeVideoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  thumbnail: { type: String },
  publishedAt: { type: Date },
  channelTitle: { type: String },
  query: { type: String, required: true }, 
}, { timestamps: true });

module.exports = mongoose.model('YouTubeVideo', YouTubeVideoSchema);

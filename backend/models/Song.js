import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide song title'],
    trim: true,
    maxlength: [100, 'Song title cannot be more than 100 characters']
  },
  artist: {
    type: String,
    required: [true, 'Please provide artist name'],
    trim: true,
    maxlength: [100, 'Artist name cannot be more than 100 characters']
  },
  album: {
    type: String,
    trim: true,
    maxlength: [100, 'Album name cannot be more than 100 characters']
  },
  duration: {
    type: Number, // Duration in seconds
    default: 0
  },
  releaseYear: {
    type: Number
  },
  genre: {
    type: [String],
    default: []
  },
  moods: {
    type: [String],
    default: []
  },
  // For storing external API IDs
  externalIds: {
    lastfm: String,
    spotify: String,
    youtube: String
  },
  imageUrl: {
    type: String,
    default: '/images/default-album-cover.jpg'
  },
  previewUrl: {
    type: String
  },
  popularity: {
    type: Number,
    min: 0,
    max: 10000000000,
    default: 0
  },
  // User who added this song (if applicable)
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for better search performance
SongSchema.index({ title: 'text', artist: 'text' });

const Song = mongoose.model('Song', SongSchema);

export default Song;
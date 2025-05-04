// models/Playlist.js
import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide playlist title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    default: '',
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  coverUrl: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // Not required for featured playlists coming from external API
  },
  songs: {
    type: [{
      songId: String,
      title: String,
      artist: String,
      album: String,
      coverUrl: String,
      duration: Number,
      preview: String
    }],
    default: []
  },
  songCount: {
    type: Number,
    default: 0
  },
  deezerRef: {
    type: String,
    default: null
  },
  featured: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Virtual for calculating total duration from songs array
PlaylistSchema.virtual('calculatedDuration').get(function() {
  if (this.songs && this.songs.length > 0) {
    return this.songs.reduce((total, song) => total + (song.duration || 0), 0);
  }
  return this.duration || 0;
});

// Pre-save middleware to update songCount
PlaylistSchema.pre('save', function(next) {
  if (this.isModified('songs')) {
    this.songCount = this.songs.length;
    // Update total duration if songs are changed
    this.duration = this.songs.reduce((total, song) => total + (song.duration || 0), 0);
  }
  next();
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);

export default Playlist;
import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a playlist title'],
    trim: true,
    maxlength: [50, 'Title cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  coverUrl: {
    type: String,
    default: 'https://i1.sndcdn.com/artworks-000541901130-1jskq9-t500x500.jpg'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  songs: [{
    title: {
      type: String,
      required: true
    },
    artist: {
      type: String,
      required: true
    },
    coverUrl: {
      type: String
    },
    trackUrl: {
      type: String
    },
    duration: {
      type: String
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Virtual field for song count
playlistSchema.virtual('songCount').get(function() {
  return this.songs.length;
});

// Ensure virtuals are included when converting to JSON
playlistSchema.set('toJSON', { virtuals: true });
playlistSchema.set('toObject', { virtuals: true });

const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist;

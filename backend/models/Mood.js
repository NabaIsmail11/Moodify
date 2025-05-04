import mongoose from 'mongoose';

const MoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide mood name'],
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    required: [true, 'Please provide mood description'],
    trim: true
  },
  color: {
    type: String,
    default: '#0396FF'
  },
  gradient: {
    type: String,
    default: 'linear-gradient(135deg, #0396FF, #0D47A1)'
  },
  tags: {
    type: [String],
    validate: {
      validator: function(tags) {
        return tags.length > 0;
      },
      message: 'At least one tag is required'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Mood', MoodSchema);

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email'
    ],
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  profilePicture: {
    type: String,
    default: 'https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2Ffe2847a838ab618ba01bff598fdcc46f.1000x1000x1.png'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  followers: {
    type: Number,
    default: 0
  },
  following: {
    type: Number,
    default: 0
  },
  topArtists: [{
    name: String,
    imageUrl: String,
    genre: String
  }],
  topTracks: [{
    title: String,
    artist: String,
    coverUrl: String,
    duration: String,
    plays: {
      type: Number,
      default: 0
    }
  }],
  playlists: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    mood: {
      type: String,
      enum: ['happy', 'sad', 'relaxed', 'energetic', 'romantic', 'chill', 'custom'],
      default: 'custom'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tracks: [{
      title: String,
      artist: String,
      coverUrl: String,
      duration: String,
      plays: {
        type: Number,
        default: 0
      }
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate some default top artists and tracks for new users
userSchema.pre('save', function(next) {
  if (this.isNew) {
    // Default top artists
    this.topArtists = [
      {
        name: "The Marías",
        imageUrl: "https://i.scdn.co/image/ab6761610000e5ebaf586afa2b397f1288683a76",
        genre: "Indie Pop"
      },
      {
        name: "Adele",
        imageUrl: "https://akamai.sscdn.co/uploadfile/letras/fotos/7/a/d/4/7ad49aeb3a90ad1ecf53bd979e99a486.jpg",
        genre: "Pop"
      },
      {
        name: "Doechii",
        imageUrl: "https://www.billboard.com/wp-content/uploads/2025/03/doechii-sami-drasin-february-2025-1260.jpg?w=1260&h=840&crop=1",
        genre: "Pop"
      },
      {
        name: "Kendrick Lamar",
        imageUrl: "https://variety.com/wp-content/uploads/2017/11/kendrick-lamar-variety-hitmakers.jpg?w=1000&h=562&crop=1",
        genre: "Rap"
      }
    ];

    // Default top tracks
    this.topTracks = [
      {
        title: "Happy",
        artist: "Pharrell Williams",
        coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2F08c9cccbe508d70ae05be9c0e7d05358.1000x1000x1.jpg",
        duration: "5:55",
        plays: 42
      },
      {
        title: "Blinding Lights",
        artist: "Weekend",
        coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2F34c1c35ca27a735e6e5f18611acb1c16.1000x1000x1.png",
        duration: "4:45",
        plays: 38
      },
      {
        title: "BIRDS OF A FEATHER",
        artist: "Billie Eilish",
        coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2Ffe2847a838ab618ba01bff598fdcc46f.1000x1000x1.png",
        duration: "3:20",
        plays: 35
      },
      {
        title: "Someone Like You",
        artist: "Adele",
        coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2F48caff7f3cd18b4f4e9b2db1baf3d576.1000x1000x1.png",
        duration: "3:53",
        plays: 33
      }
    ];

    // Default playlists
    this.playlists = [
      {
        name: "Happy Vibes",
        description: "Songs to boost your mood and make you feel fantastic all day long",
        mood: "happy",
        tracks: [],
        coverUrl: "https://i.scdn.co/image/ab67706f00000002261b4231fdb64c7adbdd7d1c"
      },
      {
        name: "Chill Mode",
        description: "Perfect for relaxation and unwinding after a long day",
        mood: "chill",
        tracks: [],
        coverUrl: "https://i.scdn.co/image/ab67616d0000b273762d1d1d540c6b98693354fd"
      },
      {
        name: "Workout Intensity",
        description: "Keep your energy high and push through any workout with these energetic tracks",
        mood: "energetic",
        tracks: [],
        coverUrl: "https://i.scdn.co/image/ab67616d00001e0256da1ee51c2ebfb001c7ef8a"
      },
      {
        name: "Focus Flow",
        description: "Concentrate better with these carefully selected instrumental tracks",
        mood: "relaxed",
        tracks: [],
        coverUrl: "https://i1.sndcdn.com/artworks-m5GmzxRYjSNAcqsi-XVbAiA-t500x500.jpg"
      }
    ];
    
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;



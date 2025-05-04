# 🎧 **Moodify – Music That Matches Your Mood**
**Moodify** is a full-stack **MERN** application that recommends music based on your mood. Whether you're feeling happy, sad, calm, or energetic, Moodify suggests songs that match how you feel — instantly.It's a smooth, responsive experience built to help you connect with music that *feels right* in the moment.

## **How It Works**
- **MongoDB** is used to store user data like username and playlists of user.
- **Last.fm API** provides mood-based music recommendations using emotional tags.
- **Deezer API** fetches top songs and offers audio previews.

## **Tech Stack**
- **Frontend:** React.js, Axios, React Router  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB(Atlas) + Mongoose  
- **APIs:** Last.fm & Deezer
- - Try the **"Surprise Me"** feature to discover new tracks with a single click

## **Getting Started**
### 1. **Clone the repository**
```bash
git clone https://github.com/NabaIsmail11/moodify.git
cd moodify

npm install

PORT=5000
MONGO_URI=your mongodb connection
LASTFM_API_KEY=your_lastfm_api_key

cd frontend
npm install

REACT_APP_API_URL=http://localhost:5000
npm start




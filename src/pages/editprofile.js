import React, { useState, useRef } from 'react';
import '../styling/editprofile.css';

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
  const [username, setUsername] = useState(userData.username);
  const [profileImage, setProfileImage] = useState(userData.profileImage);
  const [previewImage, setPreviewImage] = useState(userData.profileImage);
  const fileInputRef = useRef(null);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      
      // In a real app, you would upload this file to your server
      // and get back a permanent URL. For now, we'll just use the preview URL
      setProfileImage(imageUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...userData,
      username,
      profileImage
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="edit-profile-modal">
        <div className="modal-header">
          <h2>Edit profile</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="profile-image-editor">
            <div className="profile-image-container" onClick={handleImageClick}>
              <img src={previewImage} alt="Profile" />
              <div className="image-overlay">
                <div className="edit-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                  </svg>
                </div>
                <span>Choose photo</span>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
              accept="image/*" 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Name</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Add a name"
              maxLength="30"
            />
            <div className="input-description">
              This name will appear on your profile.
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
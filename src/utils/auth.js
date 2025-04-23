// src/utils/auth.js
export const loginUser = (email, password) => {
    // In a real app, this would call your authentication API
    console.log(`Logging in with email: ${email}`);
    return { success: true };
  };
  
  export const registerUser = (email, password) => {
    // In a real app, this would call your registration API
    console.log(`Registering with email: ${email}`);
    return { success: true };
  };
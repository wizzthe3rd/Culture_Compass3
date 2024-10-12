// apiService.js
import { getCurrentUserToken } from './authService';  // This gets the Firebase ID token

export const makeAuthenticatedRequest = async (url) => {
  try {
    const idToken = await getCurrentUserToken();  // Fetch Firebase ID token

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,  // Set the token in Authorization header
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from Flask API');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error making authenticated request:', error.message);
  }
};

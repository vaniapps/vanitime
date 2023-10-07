// import { google } from 'googleapis';
// import { OAuth2Client } from 'google-auth-library';

// // Your OAuth credentials
// const CLIENT_ID = '526565895378-mqhfg5dceb6e4d7jta7qte8sfki2vdpa.apps.googleusercontent.coming';
// const CLIENT_SECRET = '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';
// const REDIRECT_URI = "http://localhost:3000";

// // Create a new OAuth2Client with your credentials
// const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// // Function to generate an OAuth URL for user login
// function getAuthUrl() {
//   return oAuth2Client.generateAuthUrl({
//     access_type: 'offline', // Allow for refresh tokens
//     scope: ['https://www.googleapis.com/auth/drive.file'], // The scope for Google Drive
//   });
// }

// // Function to set credentials after user grants access
// async function setCredentials(code) {
//   try {
//     const { tokens } = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(tokens);
//     console.log('OAuth credentials set successfully.');
//   } catch (error) {
//     console.error('Error setting OAuth credentials:', error);
//   }
// }

// // Function to get the authenticated OAuth client
// function getOAuthClient() {
//   return oAuth2Client;
// }

// export { getAuthUrl, setCredentials, getOAuthClient };

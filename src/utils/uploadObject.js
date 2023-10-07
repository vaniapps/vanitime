// // UploadObject.js
// import { google } from 'googleapis';
// import { getOAuthClient } from './auth';

// async function uploadObject(key, value) {
//   // Authenticate the user with OAuth here
//   const authClient = await getOAuthClient();

//   // Create or update a file on Google Drive with the key-value pair
//   const drive = google.drive({ version: 'v3', auth: authClient });
//   const fileMetadata = {
//     name: 'key_value.json',
//   };
//   const media = {
//     mimeType: 'application/json',
//     body: JSON.stringify({ [key]: value }),
//   };

//   await drive.files.create({
//     resource: fileMetadata,
//     media: media,
//   });
// }

// export default uploadObject;

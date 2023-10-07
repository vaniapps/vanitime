// // DownloadObject.js
// import { google } from 'googleapis';
// import { getOAuthClient } from './auth';

// async function downloadObject() {
//   // Authenticate the user with OAuth here
//   const authClient = await getOAuthClient();

//   // Search for and download the key-value file
//   const drive = google.drive({ version: 'v3', auth: authClient });
//   const files = await drive.files.list({ q: "name='key_value.json'" });
//   if (files.data.files.length > 0) {
//     const fileId = files.data.files[0].id;
//     const response = await drive.files.get({ fileId, alt: 'media' });
//     const keyValuePair = JSON.parse(response.data);
//     return keyValuePair;
//   } else {
//     throw new Error('Key-value file not found on Google Drive.');
//   }
// }

// export default downloadObject;

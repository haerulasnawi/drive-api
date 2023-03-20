const { google } = require('googleapis')
const CLIENT_ID = '962151909362-qqpsjennpmcqqkjs8ve76d32ij3mfdqg.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04zwW4BoHYKEtCgYIARAAGAQSNwF-L9IrFJ0FBxjJhah-GaAD_8sRiteCBZJe1-xac9Zx6XfaOunf9rXtscwuRbzzie3J22OIOXU';
const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});

module.exports = drive
/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
let API_KEY = "";

let CLIENT_ID = "";

async function loadClientData() {
    const res = await fetch('/env/data');  // 1. fetch from backend
    const data = await res.json();               // 2. parse JSON
    
    CLIENT_ID = data.CLIENT;             // 3. get real value
    API_KEY = data.API;
}
loadClientData()



// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
});
gapiInited = true;
maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
});
gisInited = true;
maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.visibility = 'visible';
}
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
    throw (resp);
    }
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('authorize_button').innerText = 'Refresh';
    await listMajors();
};

if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({prompt: 'consent'});
} else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
}
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
const token = gapi.client.getToken();
if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById('signout_button').style.visibility = 'hidden';
}
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * 
 * MY SPREADSHEET
 * https://docs.google.com/spreadsheets/d/11v0jMvdC-JvCrdw5JsuyMIfioxCoutvzx8yrnTRl4x4/edit?pli=1&gid=0#gid=0
 */
//   async function listMajors() {
//     let response;
//     try {
//       // Fetch first 10 files
//       response = await gapi.client.sheets.spreadsheets.values.get({
//         spreadsheetId: '11v0jMvdC-JvCrdw5JsuyMIfioxCoutvzx8yrnTRl4x4',
//         range: 'Class Data!A2:E',
//       });
//     } catch (err) {
//       document.getElementById('content').innerText = err.message;
//       return;
//     }
//     const range = response.result;
//     if (!range || !range.values || range.values.length == 0) {
//       document.getElementById('content').innerText = 'No values found.';
//       return;
//     }
//     // Flatten to string to display
//     const output = range.values.reduce(
//         (str, row) => `${str}${row[0]}, ${row[4]}\n`,
//         'Name, Major:\n');
//     document.getElementById('content').innerText = output;
//   }

async function listMajors() {
let response;
try {
    response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '11v0jMvdC-JvCrdw5JsuyMIfioxCoutvzx8yrnTRl4x4',
    range: 'Sheet1!A1:Z',
    });
} catch (err) {
    document.getElementById('content').innerText = err.message;
    return;
}

const data = response.result.values;

if (!data || data.length === 0) {
    document.getElementById('content').innerText = 'No values found.';
    return;
}

// Replace undefined cells with empty string
const output = data
    .map(row => row.map(cell => cell ?? '').join(' | '))
    .join('\n');

document.getElementById('content').innerText = output;
}
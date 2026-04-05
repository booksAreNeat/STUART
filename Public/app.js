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
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';
document.getElementById('patient_select_title').style.visibility = 'hidden';
document.getElementById('patient_select').style.visibility = 'hidden';
document.getElementById('selected_patient_title').style.visibility = 'hidden';
document.getElementById('perscription_select_title').style.visibility = 'hidden';
document.getElementById('perscription_select').style.visibility = 'hidden';
document.getElementById('status_select_title').style.visibility = 'hidden';
document.getElementById('status_select').style.visibility = "hidden";

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


//leftover test code from the api demo
async function listMajors() {
    let response_all;
    try {
        response_all = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '11v0jMvdC-JvCrdw5JsuyMIfioxCoutvzx8yrnTRl4x4',
        range: 'Sheet1!A1:Z',
        });
    } catch (err) {
        document.getElementById('content').innerText = err.message;
        return;
    }

    const data = response_all.result.values;

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

//make the patient select visible
document.getElementById('patient_select_title').style.visibility = 'visible';
document.getElementById('patient_select').style.visibility = 'visible';


//much nicer way of choosing patient, perscription and status

//first heres the maps 
//map of patient sheets
const patient_Map = {
    PID1:   'Arlen Voss',
    PID2:   'Mira Calder',
    PID3:   'Theo Renshaw',
    PID4:   'Livia Harten',
    PID5:   'Dorian Pike',
    PID6:   'Elara Quinn',
    PID7:   'Rowan Keats',
    PID8:   'Sienna Vale',
    PID9:   'Callum Frost',
    PID10:  'Nyla Mercer',
    PID11:  'Jasper Wren',
    PID12:  'Kael Thorne'
};

//map of perscription cells 
const prescription_Map = {
    perscription1:  'C2:G2',
    perscription2:  'C3:G3'
};

//reusable function that can read data from google sheets within the specified range. 
async function read_From_Sheets(range) {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '11v0jMvdC-JvCrdw5JsuyMIfioxCoutvzx8yrnTRl4x4',
            range,
        });
        const data = response.result.values;

        if (!data || data.length === 0) {
            document.getElementById('patient_choice').innerText = 'No values found.';
            return;
        }

        // Replace undefined cells with empty string
        const output = data
            .map(row => row.map(cell => cell ?? '').join(' | '))
            .join('\n');

        return output;

    } catch (err) {
        document.getElementById('patient_choice').innerText = err.message;
        return;
    }
    
    
}

//function for choosing a patient
async function select_Patient() {
    //get the patient from the dropdown
    const selected_Patient = document.getElementById('patient_select').value;
    const sheet_Name = patient_Map[selected_Patient];

    if(!sheet_Name) return;     //returns if 

    //get the data for that patient using the read method 
    // Wrap in try/catch just in case
    try {
        const output = await read_From_Sheets(`${sheet_Name}!A1:Z`);
        document.getElementById('patient_choice').innerText = output;
    } catch (err) {
        // This is a safeguard — should rarely happen now
        document.getElementById('patient_choice').innerText = `Unexpected error: ${err.message}`;
    }
    
    //make the perscription dropdown visible
    document.getElementById('perscription_select_title').style.visibility = 'visible';
    document.getElementById('perscription_select').style.visibility = 'visible';
} 

//method to choose a perscription and display it 
async function select_Perscription() {
    const selected_Patient = document.getElementById("patient_select").value;
    const sheet_Name = patient_Map[selected_Patient];

    const selected_Prescription = document.getElementById("perscription_select").value;
    const range = prescription_Map[selected_Prescription];

    if (!sheet_Name || !range) return;

    // Load the perscription using the read sheets method
    const output = await read_From_Sheets(`${sheet_Name}!${range}`);

    document.getElementById('perscription_choice').style.visibility = 'visible';
    document.getElementById('perscription_choice').innerText = output;

    // make the select status dropdown visible
    document.getElementById('status_select_title').style.visibility = 'visible';
    document.getElementById('status_select').style.visibility = 'visible';
}


//finction to update the status of a perscription
async function select_Status() {
    if (!gapiInited) await initializeGapiClient();

    // Check for token
    if (!gapi.client.getToken()) {
        alert("Please authorize first!");
        return;
    }

    const selected_Patient = document.getElementById("patient_select").value;
    const sheet_Name = patient_Map[selected_Patient];
    const selected_Prescription = document.getElementById("perscription_select").value;
    const range = prescription_Map[selected_Prescription];
    const selected_Status = document.getElementById("status_select").value;

    // Basic checks
    if (!sheet_Name || !selected_Prescription || !range || !selected_Status) return;

    // Determine the row for the prescription
    const match = range.match(/C(\d+)/);
    const perscription_Row = match ? match[1] : null;
    const status_Cell = `F${perscription_Row}`;
    const new_Status = [[selected_Status]];

    try {
        await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: '11v0jMvdC-JvCrdw5JsuyMIfioxCoutvzx8yrnTRl4x4',
            range: `${sheet_Name}!${status_Cell}`,
            valueInputOption: 'RAW',
            resource: {
                values: new_Status,
            },
        });

        // reload the perscription using the read sheets method
        const patient_output = await read_From_Sheets(`${sheet_Name}!A1:Z`)
        const perscription_output = await read_From_Sheets(`${sheet_Name}!${range}`);
        document.getElementById('status_choice').innerText = perscription_output;
        document.getElementById('perscription_choice').innerText = perscription_output;
        document.getElementById('patient_choice').innerText = patient_output;

    } catch (err) {
        document.getElementById('status_select').style.border = "2px solid red";
        console.error('Error updating status:', err);
    }
}
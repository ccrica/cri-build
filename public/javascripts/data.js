//json data simple (data.js original)
window.onload = function() {
    //handleFormSubmit();
    fetchSessionKeyDetails();
    setTokenexValue();
}

document.getElementById('submitForm').addEventListener('submit', function(event) {
// Prevent the form from being submitted normally
event.preventDefault();

// Get the form data
const token = document.getElementById('name').value;

// Log the form data
console.log(`Form submitted with name: ${token}`);

// Fetch data from the server
fetch('/submit', {
method: 'POST',
headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
},
body: `name=${encodeURIComponent(token)}`,
})
.then(() => {
return fetch(`/response_data?name=${encodeURIComponent(token)}`);
})
.then(response => {
console.log('Raw response from server:', response);
return response.json();
})
.then(data => {
console.log('Data from server:', data);
const firstElement = data[0];

// Create a structured view of the data
const dataContainer = document.getElementById('dbData');
dataContainer.innerHTML = `
    <p>Submit Date: ${firstElement.submitdate}</p>
    <p>Email: ${firstElement.email}</p>
    <p>Langue: ${firstElement.startlanguage}</p>
`;
document.getElementById('responseReceived').textContent = "Response";
document.documentElement.lang = firstElement.startlanguage;
console.log(document.documentElement.lang);


// Fetch the session key and call recupResult with the token and language
return fetch('/env')
    .then(response => response.json())
    .then(data => {
        const { LS_API_USER, LS_API_PWD } = data;
        return lsapi(LS_API_USER, LS_API_PWD);
    })
    .then(sessionKey => {
        console.log('Session key:', sessionKey);
        return recupResult(sessionKey, token, firstElement.startlanguage);
    })
    .catch(error => {
        console.error('Problem with request:', error.message);
    });
});
});

function fetchSessionKeyDetails(isSubmitClicked = false) {
    fetch('/sessionKeyDetails')
        .then(response => {
            if (!response.ok) {
                throw new Error(`ça fonctionne pas : ${response.status}`);
            }
            return response.json();
        })
        .then(sessionKeyDetails => {
            if (!isSubmitClicked) {
                document.getElementById('responseReceived').textContent = sessionKeyDetails.id;
            }
        })
        .catch(error => {
            console.log('Fetch error: ', error);
        });
}

function lsapi(LS_API_USER, LS_API_PWD) {
const url = 'https://ls.dumspiro.ch/index.php?r=admin/remotecontrol';
const options = {
method: 'POST',
headers: {
    'Content-Type': 'application/json',
    'Content-Length': '88'
},
body: JSON.stringify({method: 'get_session_key', params: [LS_API_USER, LS_API_PWD], id: 1})
};

return fetch(url, options)
.then(response => response.json()) // Parse the response as JSON
.then(data => {
    console.log('Response from ls.dumspiro.ch:', data);
    return data.result; // Return the session key
})
.catch(error => {
    console.error('Problem with request:', error.message);
    throw error;
});
}

function recupResult(sessionKey, token, language) {
    const url = 'https://ls.dumspiro.ch/index.php?r=admin/remotecontrol';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': '88'
        },
        body: JSON.stringify({
            method: 'export_responses_by_token',
            params: [sessionKey, "983971", "json", token, language, "all", "code", "long"], 
            id: 1
        })
    };
    return fetch(url, options)
    .then(response => response.json())
    .then(data => {
        // Show the container
        let container = document.querySelector('.container');
        container.classList.remove('container-hidden');
        container.classList.add('container-visible');

        console.log('Response from second request:', data);
        if (data.result) {
            // Decode the Base64-encoded JSON data
            const binaryString = atob(data.result);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const jsonData = new TextDecoder("utf-8").decode(bytes);
            console.log('Decoded JSON data:', jsonData);

            // Create a Blob with the JSON data
            const jsonBlob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });

            // Create a link for the Blob
            const jsonURL = window.URL.createObjectURL(jsonBlob);
            const tempLink = document.createElement('a');
            tempLink.href = jsonURL;
            tempLink.setAttribute('download', `${token}.json`);
            tempLink.textContent = `Download ${token}.json`;

            // Append the link to the specific location in the HTML page
            const downloadLinkContainer = document.getElementById('downloadLinkContainer');
            if (downloadLinkContainer) {
                downloadLinkContainer.appendChild(tempLink);
            } else {
                console.error('Could not find element with id "downloadLinkContainer"');
            }

            return JSON.parse(jsonData);
        }
    })
    .catch(error => {
        console.error('Problem with second request:', error.message);
        throw error;
    });
}

function setTokenexValue() {
fetch('/tokenex')
.then(response => response.json())
.then(data => {
    const inputField = document.getElementById('name');
    if (inputField) {
        inputField.value = data.TOKENEX;
    } else {
        console.error('Could not find element with id "name"');
    }
})
.catch(error => {
    console.error('Problem with request:', error.message);
});
}